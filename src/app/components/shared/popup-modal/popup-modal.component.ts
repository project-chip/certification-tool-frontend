/**
 *
 * Copyright (c) 2023 Project CHIP Authors
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
import { Component, Input, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { TestRunAPI } from 'src/app/shared/core_apis/test-run';
import { DEFAULT_POPUP_OBJECT } from 'src/app/shared/utils/constants';
import { DataService } from 'src/app/shared/web_sockets/ws-config';
import { environment } from 'src/environments/environment';
import { commaSeparatedHexToBase64 } from './image-utils';
import shaka from 'shaka-player/dist/shaka-player.compiled';

declare class EncodedVideoChunk {
  constructor(chunk: any);
}

type VideoDecoderConfig = {
  codec: string;
  hardwareAcceleration: string;
};

declare class VideoDecoder {
  constructor(decoder: any);
  decode(chunk: any): void;
  reset(): void;
  close(): void;
  configure(config: VideoDecoderConfig): void;
}

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.scss']
})
export class PopupModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() popupId!: string;
  @Input() header!: string;
  @Input() subHeader!: string;
  @Input() buttons!: any;
  @Input() inputItems!: any;
  @Input() messageId!: any;
  fileName: any = '';
  file?: File;
  streamSrc: string | null;
  streamContents: string[];
  currentStream: number | null;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  private socket!: WebSocket | null;
  private ctx!: CanvasRenderingContext2D | null;
  private decoder!: VideoDecoder | null;
  private player!: shaka.Player;
  @ViewChild('videoCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>
  @ViewChild('imageView') imageRef!: ElementRef<HTMLImageElement>;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(public sharedAPI: SharedAPI, private dataService: DataService, public testRunAPI: TestRunAPI) {
    this.fileName = '';
    this.streamSrc = null;
    this.streamContents = [];
    this.currentStream = null;
  }

  ngOnInit(): void {
    if (this.popupId.includes('STREAM_')) {
      this.decoder = new VideoDecoder({
        output: (frame: any) => {
          if (this.ctx) {
            this.ctx.drawImage(frame, 0, 0, 640, 480);
          }
          frame.close();
        },
        error: (err: any) => {},
      });
      this.decoder.configure({ codec: "avc1.42E01E", hardwareAcceleration: 'prefer-software' });
      this.connectWebSocket();
    }
    if (this.popupId.includes('PUSH_')) {
      this.loadStreams();
      this.initializeShakaPlayer();
    }
  }

  ngAfterViewInit(): void {
    if (this.popupId.includes('STREAM_')) {
      this.initCanvas();
    }
    if (this.popupId.includes('IMAGE_')) {
      const data = this.sharedAPI.getCustomPopupData();
      if (data.imgHexStr) {
        const imgHexStr = data.imgHexStr;
        var byteStream = commaSeparatedHexToBase64(imgHexStr);
        this.imageRef.nativeElement.src = "data:image/jpg;base64," + byteStream;
      }
    }

    if (this.popupId.includes('PUSH_')) {
      this.player.attach(this.videoPlayer.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.socket && this.socket.readyState == WebSocket.OPEN) {
      this.socket.close();
      this.socket = null;
    }
    if (this.decoder){
      this.decoder.close();
      this.decoder = null;
    }
    if (this.player){
      this.player
        .destroy()
        .then(() => console.log("Shaka player destroyed"))
        .catch((e: shaka.util.Error) => console.error("Failed to destroy Shaka player", e));
    }
  }

  loadStreams() {
    this.isLoading = true;
    this.errorMessage = null;
    this.testRunAPI.fetchPushAVStreamsList();
    
    // Check if streams are available after a short delay
    setTimeout(() => {
      const streams = this.testRunAPI.getPushAVStreamsList();
      if (!streams || streams.length === 0) {
        this.errorMessage = 'No video streams available. Click "Refresh Streams" to check for new streams.';
      }
      this.isLoading = false;
    }, 1000);
  }

  updateStreamSrc(streamId: number) {
    this.errorMessage = null;
    this.isLoading = true;
    
    const streams: { id: number, files: string[] }[] = this.testRunAPI.getPushAVStreamsList();
    const stream = streams.find(s => s.id === streamId);
    if (!stream) {
      this.errorMessage = `Stream with ID ${streamId} not found.`;
      this.isLoading = false;
      return;
    }

    this.streamContents = stream.files;
    const streamPath = this.pickEntryPoint(stream.files);
    if (!streamPath) {
      this.errorMessage = `No DASH MPD or HLS M3U8 manifest found for stream ${streamId}. Cannot view stream.`;
      this.isLoading = false;
      return;
    }

    this.streamSrc = `${environment.testPushAVServerURL}streams/${streamId}/${streamPath}`;
    this.player.load(this.streamSrc).then(() => {
      this.currentStream = streamId;
      this.isLoading = false;
    }).catch((e: shaka.util.Error) => {
      console.error(`Error loading stream: ${streamId}`, e);
      this.errorMessage = `Failed to load stream ${streamId}. Error: ${e.message || 'Unknown error occurred'}`;
      this.isLoading = false;
    });
  }

  refreshStreams() {
    this.streamContents = [];
    this.currentStream = null;
    this.loadStreams();
  }

  private pickEntryPoint(files: string[]): string | null {
    // Check for DASH first
    const mpd = files.find(f => f.endsWith('.mpd'));
    if (mpd) return mpd;

    // HLS fallback
    const m3u8s = files.filter(f => f.endsWith('.m3u8'));
    if(m3u8s.length === 0) return null;

    //Prefer master-like names if available
    const master = m3u8s.find(f => f.toLowerCase().includes('master'));
    if(master) return master;

    //pick the first m3u8 file as entry point
    return m3u8s[0];
  }

  private initializeShakaPlayer(){
    this.player = new shaka.Player();
    this.player.configure({
      streaming: {
        bufferingGoal: 30,
        failureCallback: (error: shaka.util.Error) => {
          console.error('Streaming error:', error);
        }
      }
    });
    shaka.polyfill.installAll();
  }

  private initCanvas() {
    if (this.canvasRef) {
      const canvas = this.canvasRef.nativeElement;
      this.ctx = canvas.getContext('2d');
    }
  }

  private connectWebSocket(): void {
    if (!this.socket) {
      this.socket = new WebSocket(environment.streamBaseURL);
      this.socket.binaryType = "arraybuffer";

      this.socket.onmessage = (event) => {
        try {
          const chunck = new EncodedVideoChunk({
            type: "key",
            timestamp: performance.now(),
            data: new Uint8Array(event.data)
          });
          if (this.decoder) {
            this.decoder.decode(chunck);
          } else {
            console.log("Decoder is not intialized");
          }
        } catch (err) {
          console.error("Encountered error while decoding chunk: ", err);
        }
      };
    }
  }

  cancel(event: any) {
    const closeIcon = event.target.className;
    if (closeIcon.includes('p-dialog-header-close-icon')) {
      this.sharedAPI.setShowCustomPopup('');
      this.sharedAPI.setCustomPopupData(DEFAULT_POPUP_OBJECT);
      /* eslint-disable @typescript-eslint/naming-convention */
      const promptResponse = {
        'type': 'prompt_response', 'payload':
          { 'response': ' ', 'status_code': -1, 'message_id': this.messageId }
      };
      /* eslint-enable @typescript-eslint/naming-convention */
      this.dataService.send(promptResponse);
    }
  }
  onUpload(event: any) {
    this.file = event.target.files.item(0);
    this.fileName = this.file?.name;
  }
  checkInput(data: any) {
    if ((this.fileName !== '' && this.popupId === 'FILE_UPLOAD_' + this.messageId)
      || this.popupId === 'CREATE-TEST-RUN') {
      return false;
    } else if (data && data[0].value || this.popupId === 'ABORT') {
      return false;
    } else {
      return true;
    }
  }
}
