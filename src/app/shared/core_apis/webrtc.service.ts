/**
 *
 * Copyright (c) 2025 Project CHIP Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import {
  WebRTCWebSocketService,
  WebRTCRequest,
} from "../web_sockets/webrtc-ws-config";

export const MessageEventTypes = Object.freeze({
  CREATE_PEER_CONNECTION: "CREATE_PEER_CONNECTION",
  CREATE_OFFER: "CREATE_OFFER",
  CREATE_ANSWER: "CREATE_ANSWER",
  SET_REMOTE_OFFER: "SET_REMOTE_OFFER",
  SET_REMOTE_ANSWER: "SET_REMOTE_ANSWER",
  SET_REMOTE_ICE_CANDIDATES: "SET_REMOTE_ICE_CANDIDATES",
  GET_LOCAL_ICE_CANDIDATES: "LOCAL_ICE_CANDIDATES",
  GET_LOCAL_DESCRIPTION: "GET_LOCAL_DESCRIPTION",
  GET_PEER_CONNECTION_STATE: "GET_PEER_CONNECTION_STATE",
  PEER_CONNECTION_STATE: "PEER_CONNECTION_STATE",
  GATHERING_STATE_COMPLETE: "GATHERING_STATE_COMPLETE",
  CLOSE_PEER_CONNECTION: "CLOSE_PEER_CONNECTION",
} as const);

export interface RTCIceCandidate {
  candidate: string;
  sdpMLineIndex: number | null;
  sdpMid: string | null;
}

/**
 * WebRTCSession - Represents a single peer connection session
 */
class WebRTCSession {
  private peerConnection: RTCPeerConnection | null = null;
  private remoteStream: MediaStream | null = new MediaStream();
  private localStreamSub?: Subscription;
  private remoteAudioAnalyser?: AnalyserNode;
  private localAudioAnalyser?: AnalyserNode;
  private audioContext?: AudioContext;
  private animationId?: number;

  private _remoteStream$ = new BehaviorSubject<MediaStream | null>(null);
  private _connectionState$ = new BehaviorSubject<string>("unknown");
  private _remoteAudioLevel$ = new BehaviorSubject<number>(0);
  private _localAudioLevel$ = new BehaviorSubject<number>(0);

  public remoteStream$ = this._remoteStream$.asObservable();
  public connectionState$ = this._connectionState$.asObservable();
  public remoteAudioLevel$ = this._remoteAudioLevel$.asObservable();
  public localAudioLevel$ = this._localAudioLevel$.asObservable();

  constructor(
    public readonly sessionId: string,
    private webrtcWebSocketService: WebRTCWebSocketService,
    private localStream$: Observable<MediaStream | null>
  ) { }

  public initializePeerConnection(request: WebRTCRequest): void {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    this.peerConnection = new RTCPeerConnection(configuration);

    this.peerConnection.addTransceiver("audio", { direction: "sendrecv" });
    this.peerConnection.addTransceiver("video", { direction: "recvonly" });

    this.localStreamSub = this.localStream$
      .pipe(filter((stream): stream is MediaStream => !!stream))
      .subscribe((stream) => {
        stream.getTracks().forEach((track) => {
          console.debug("Adding local media stream");
          this.peerConnection!.addTrack(track, stream);
        });
        // Set up audio level analysis for local stream
        this.setupAnalyzer(stream, 'local');
      });

    // Set up event listeners and report as we receive
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && event.candidate?.candidate != "") {
        this.sendIceCandidate(event.candidate, request);
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStream?.addTrack(event.track);
      this._remoteStream$.next(this.remoteStream);
      console.debug(`Session ${this.sessionId}: Remote stream received`);

      // Set up audio level analysis for remote stream
      let stream: MediaStream;
      if (event.track.kind == "audio") {
        if (event.streams && event.streams[0]) {
          stream = event.streams[0];
        } else {
          // construct stream manually from the track
          stream = new MediaStream([event.track]);
        }

        // only try analyser if it has audio
        if (stream.getAudioTracks().length > 0) {
          this.setupAnalyzer(stream, 'remote');
        } else {
          console.warn("Remote stream has no audio tracks yet");
        }
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState || "unknown";
      console.debug(
        `Session ${this.sessionId}: Connection state changed to ${state}`
      );
      this._connectionState$.next(state.toUpperCase());
      const response = request.createResponse(
        state,
        null,
        MessageEventTypes.PEER_CONNECTION_STATE
      );
      this.webrtcWebSocketService.send(response);
    };

    this.peerConnection.onicegatheringstatechange = () => {
      const state = this.peerConnection?.iceGatheringState || "unknown";
      console.debug(
        `Session ${this.sessionId}: ICE connection state changed to ${state}`
      );
      if (state == "complete") {
        const response = request.createResponse(
          null,
          null,
          MessageEventTypes.GATHERING_STATE_COMPLETE
        );
        this.webrtcWebSocketService.send(response);
      }
    };
    this.updateLevels();
    this.webrtcWebSocketService.send(request.createResponse());
  }

  public async createOffer(request: WebRTCRequest): Promise<void> {
    try {
      const offer = await this.peerConnection!.createOffer();
      await this.peerConnection!.setLocalDescription(offer);
      this.webrtcWebSocketService.send(request.createResponse(offer.sdp));
    } catch (error) {
      const err = `Session ${this.sessionId}: Error creating offer: ${error}`;
      this.sendErrorResponse(err, request);
    }
  }

  public async createAnswer(request: WebRTCRequest): Promise<void> {
    try {
      const answer = await this.peerConnection!.createAnswer();
      await this.peerConnection!.setLocalDescription(answer);
      const response = request.createResponse(answer.sdp);
      this.webrtcWebSocketService.send(response);
    } catch (error) {
      const err = `Session ${this.sessionId}: Error creating answer: ${error}`;
      this.sendErrorResponse(err, request);
    }
  }

  public async setRemoteOffer(request: WebRTCRequest): Promise<void> {
    try {
      const message = request.message;
      const remoteDesc = new RTCSessionDescription({
        type: "offer",
        sdp: message.data,
      });
      await this.peerConnection!.setRemoteDescription(remoteDesc);
      const response = request.createResponse();
      this.webrtcWebSocketService.send(response);
    } catch (error) {
      const err = `Session ${this.sessionId}: Error setting remote offer: ${error}`;
      this.sendErrorResponse(err, request);
    }
  }

  public async setRemoteAnswer(request: WebRTCRequest): Promise<void> {
    try {
      const message = request.message;
      const remoteDesc = new RTCSessionDescription({
        type: "answer",
        sdp: message.data,
      });

      await this.peerConnection!.setRemoteDescription(remoteDesc);
      const response = request.createResponse();
      this.webrtcWebSocketService.send(response);
    } catch (error) {
      const err = `Session ${this.sessionId}: Error setting remote answer: ${error}`;
      this.sendErrorResponse(err, request);
    }
  }

  public async setRemoteIceCandidates(request: WebRTCRequest): Promise<void> {
    try {
      const message = request.message;
      for (const candidateData of message.data) {
        // https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate/sdpMLineIndex#value
        // both sdpMLineIndex and sdpMid cannot be null as this results in value error
        const candidate = new RTCIceCandidate({
          candidate: candidateData.candidate,
          sdpMLineIndex: candidateData.sdpMLineIndex ?? 0,
          sdpMid: candidateData.sdpMid ?? "0",
        });
        await this.peerConnection!.addIceCandidate(candidate);
      }
      this.webrtcWebSocketService.send(request.createResponse());
    } catch (error) {
      const err = `Session ${this.sessionId}: Error setting remote ICE candidates: ${error}`;
      this.sendErrorResponse(err, request);
    }
  }

  public reportPeerConnectionState(request: WebRTCRequest): void {
    const state = this.connectionState$;
    const response = request.createResponse(state);
    this.webrtcWebSocketService.send(response);
  }

  public reportLocalDescription(request: WebRTCRequest): void {
    const state = this.peerConnection?.localDescription;
    const response = request.createResponse(state);
    this.webrtcWebSocketService.send(response);
  }

  private sendIceCandidate(
    candidate: RTCIceCandidate,
    request: WebRTCRequest
  ): void {
    const iceCandidateResponse = {
      candidate: candidate.candidate,
      sdpMLineIndex: candidate.sdpMLineIndex,
      sdpMid: candidate.sdpMid,
    };
    const response = request.createResponse(
      iceCandidateResponse,
      null,
      MessageEventTypes.GET_LOCAL_ICE_CANDIDATES
    );
    this.webrtcWebSocketService.send(response);
  }

  private sendErrorResponse(
    errorMessage: string,
    request: WebRTCRequest
  ): void {
    console.error(errorMessage);
    const errorResponse = request.createResponse(null, errorMessage);
    this.webrtcWebSocketService.send(errorResponse);
  }

  private setupAnalyzer(stream: MediaStream, type: 'local' | 'remote'): void {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (type === 'local') {
      this.localAudioAnalyser?.disconnect();
      this.localAudioAnalyser = analyser;
    } else {
      this.remoteAudioAnalyser?.disconnect();
      this.remoteAudioAnalyser = analyser;
    }
    this.updateLevels();
  }

  private updateLevels = (): void => {
    const localData = new Uint8Array(256);
    const remoteData = new Uint8Array(256);
    if (this.localAudioAnalyser) {
      this.localAudioAnalyser.getByteTimeDomainData(localData);
      const newLevel = this.calculateLevel(localData);
      this._localAudioLevel$.next(newLevel);
    }
    if (this.remoteAudioAnalyser) {
      this.remoteAudioAnalyser.getByteTimeDomainData(remoteData);
      const newLevel = this.calculateLevel(remoteData);
      this._remoteAudioLevel$.next(newLevel);
    }

    this.animationId = requestAnimationFrame(this.updateLevels);
  }

  private calculateLevel(dataArray: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const val = (dataArray[i] - 128) / 128.0;
      sum += val * val;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    return Math.min(100, rms * 200);
  }

  public close(): void {
    this.localStreamSub?.unsubscribe();
    this.remoteStream = null;
    this._remoteStream$.next(null);
    this._remoteAudioLevel$.next(0);
    this._localAudioLevel$.next(0);
    this.localAudioAnalyser?.disconnect();
    this.remoteAudioAnalyser?.disconnect();
    this.audioContext?.close();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }
    this.peerConnection?.close();
    this.peerConnection = null;
  }
}

/**
 * WebRTCService - Manages WebRTC sessions
 */
@Injectable({ providedIn: "root" })
export class WebRTCService {
  private sessionsMap = new Map<string, WebRTCSession>();
  private webrtcMessageSubscription: Subscription | null = null;
  private _sessions$ = new BehaviorSubject<WebRTCSession[]>([]);
  private _localStream$ = new BehaviorSubject<MediaStream | null>(null);

  public sessions$ = this._sessions$.asObservable();
  public localStream$ = this._localStream$.asObservable();

  constructor(private webrtcWebSocketService: WebRTCWebSocketService) {
    this.webrtcWebSocketService.connect();
    this.setupWebSocketSubscription();
  }

  private setupWebSocketSubscription(): void {
    this.webrtcMessageSubscription =
      this.webrtcWebSocketService.messages$.subscribe(async (data: any) => {
        try {
          const request: WebRTCRequest = new WebRTCRequest(JSON.parse(data));
          await this.handleWebRTCMessage(request);
        } catch (error) {
          console.warn("Failed to handle WebRTC message:", error);
        }
      });
  }

  private async handleWebRTCMessage(request: WebRTCRequest): Promise<void> {
    const message = request.message;
    if (!message.sessionId) {
      const err = `WebRTC message missing sessionId: ${message.sessionId}`;
      this.webrtcWebSocketService.send(request.createResponse(null, err));
      return;
    }

    let session = await this.getOrCreateSessionInstance(
      message.sessionId,
      request
    );

    // Route message to session based on type
    switch (message.type) {
      case MessageEventTypes.CREATE_PEER_CONNECTION:
        session.initializePeerConnection(request);
        break;
      case MessageEventTypes.CREATE_OFFER:
        session.createOffer(request);
        break;
      case MessageEventTypes.CREATE_ANSWER:
        session.createAnswer(request);
        break;
      case MessageEventTypes.SET_REMOTE_OFFER:
        session.setRemoteOffer(request);
        break;
      case MessageEventTypes.SET_REMOTE_ANSWER:
        session.setRemoteAnswer(request);
        break;
      case MessageEventTypes.SET_REMOTE_ICE_CANDIDATES:
        session.setRemoteIceCandidates(request);
        break;
      case MessageEventTypes.GET_PEER_CONNECTION_STATE:
        session.reportPeerConnectionState(request);
        break;
      case MessageEventTypes.GET_LOCAL_DESCRIPTION:
        session.reportLocalDescription(request);
        break;
      case MessageEventTypes.CLOSE_PEER_CONNECTION:
        session.close();
        this.closeSession(message.sessionId);
        break;
      default:
        const err = `Unknown WebRTC message type: ${message.type} for session: ${message.sessionId}`;
        this.webrtcWebSocketService.send(request.createResponse(null, err));
    }
  }

  private async getOrCreateSessionInstance(
    sessionId: string,
    request: WebRTCRequest
  ): Promise<WebRTCSession> {
    if (this.sessionsMap.has(sessionId)) {
      return this.sessionsMap.get(sessionId)!;
    }

    if (request.message.type == MessageEventTypes.CLOSE_PEER_CONNECTION) {
      // currently, signalling server does not expect an aknowledgement for this
      throw new Error("No session to close")
    }

    if (request.message.type != MessageEventTypes.CREATE_PEER_CONNECTION) {
      const errMsg = `No Peer Connection exists in session: ${sessionId} for request: ${request.message.type}`;
      this.webrtcWebSocketService.send(request.createResponse(null, errMsg));
      throw new Error(errMsg);
    }

    try {
      if (this._localStream$.value == null) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        this._localStream$.next(stream);
      }
    } catch (error) {
      const errMsg = `Failed to get local media stream: ${error}`;
      this.webrtcWebSocketService.send(request.createResponse(null, errMsg));
      throw error;
    }

    const session = new WebRTCSession(
      sessionId,
      this.webrtcWebSocketService,
      this.localStream$
    );
    this.sessionsMap.set(sessionId, session);
    this.updateActiveSessions();

    console.debug(`Created new WebRTC session: ${sessionId}`);
    return session;
  }

  private closeSession(sessionId: string): void {
    this.sessionsMap.delete(sessionId);
    this.updateActiveSessions();
    console.debug(`Closed WebRTC session: ${sessionId}`);
  }

  private updateActiveSessions(): void {
    const sessions = Array.from(this.sessionsMap.values());
    this._sessions$.next(sessions);
    if (sessions.length === 0) {
      //No sessions left, clean up local stream
      const stream = this._localStream$.value;
      stream?.getTracks().forEach((track) => track.stop());
      this._localStream$.next(null);
    }
  }

  public closeAllSessions(): void {
    for (const [_, session] of this.sessionsMap) {
      session.close();
    }
    this.sessionsMap.clear();
    this.updateActiveSessions();
    console.debug("Closed all WebRTC sessions");
  }
}
