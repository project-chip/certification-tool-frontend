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
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { environment } from "../../../environments/environment";
import { catchError, tap } from "rxjs/operators";
import { EMPTY, Subject } from "rxjs";
import { SharedService } from "../core_apis/shared-utils";

export const webrtcWebSocketStateEnum = {
  closed: 0,
  connecting: 1,
  ready: 2,
  error: 3,
};

export interface WebRTCMessage {
  type: string;
  data: any;
  sessionId: string;
  error: string | null;
}

export class WebRTCRequest {
  constructor(public readonly message: WebRTCMessage) { }

  createResponse(data: any = null, error: string | null = null, optionalType: string | null = null): WebRTCMessage {
    // createResponse with no args would mean a simple success acknowledgement
    return {
      type: optionalType || this.message.type,
      sessionId: this.message.sessionId,
      data,
      error
    };
  }
}

@Injectable({
  providedIn: "root",
})
export class WebRTCWebSocketService {
  public socket$: WebSocketSubject<any> | null = null;
  public messages$: any = null;
  public readyState = webrtcWebSocketStateEnum.closed;
  private webRTCWebSocketURL = environment.webRTCWebSocketURL;

  constructor(private sharedService: SharedService) { }

  public connect(): void {
    if (!this.socket$ || this.readyState === webrtcWebSocketStateEnum.closed) {
      this.readyState = webrtcWebSocketStateEnum.connecting;
      this.socket$ = this.getNewWebSocket();

      this.socket$.subscribe({
        next: (message) => {
          this.logIncomingMessage(message);
        },
        error: (error) => {
          console.error("WebRTC WebSocket error:", error);
          this.readyState = webrtcWebSocketStateEnum.error;
        },
        complete: () => {
          console.debug("WebRTC WebSocket connection closed");
          this.readyState = webrtcWebSocketStateEnum.closed;
        },
      });

      this.messages$ = this.socket$.pipe(
        tap({
          error: (error) => {
            console.error("WebRTC WebSocket error in stream:", error);
            this.sharedService.setToastAndNotification({
              status: "error",
              summary: "WebRTC Connection Error",
              message: "Signaling server connection lost",
            });
          },
        }),
        catchError((_) => EMPTY)
      );
    }
  }

  public send(msg: any): void {
    if (this.socket$ && this.readyState === webrtcWebSocketStateEnum.ready) {
      console.debug("TX WebRTC message:", msg);
      this.socket$.next(msg);
    } else {
      console.error(
        "WebRTC WebSocket not connected. Current state:",
        this.readyState
      );
    }
  }

  public close(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
      this.readyState = webrtcWebSocketStateEnum.closed;
    }
  }

  private getNewWebSocket(): WebSocketSubject<any> {
    return webSocket({
      url: this.webRTCWebSocketURL,
      deserializer: (e: { data: any }) => e.data,
      openObserver: {
        next: () => {
          console.debug("WebRTC WebSocket connected");
          this.readyState = webrtcWebSocketStateEnum.ready;
        },
      },
      closeObserver: {
        next: () => {
          console.debug("WebRTC WebSocket connection closed");
          this.readyState = webrtcWebSocketStateEnum.closed;
        },
      },
    });
  }

  private logIncomingMessage(message: any): void {
    try {
      const dataObject =
        typeof message === "string" ? JSON.parse(message) : message;

      console.debug("RX WebRTC message:", dataObject.type, dataObject);

    } catch (error) {
      console.error("Error parsing WebRTC message:", error);
    }
  }
}

