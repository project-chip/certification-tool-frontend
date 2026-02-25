/**
 * * Copyright (c) 2023 Project CHIP Authors
 * * Licensed under the Apache License, Version 2.0 (the "License");
 * * you may not use this file except in compliance with the License.
 * * You may obtain a copy of the License at
 * * http://www.apache.org/licenses/LICENSE-2.0
 * * Unless required by applicable law or agreed to in writing, software
 * * distributed under the License is distributed on an "AS IS" BASIS,
 * * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * * See the License for the specific language governing permissions and
 * * limitations under the License.
 */

import { Component, ElementRef, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';

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
  selector: 'app-video-stream',
  templateUrl: './video-stream.component.html',
  styleUrls: ['./video-stream.component.scss']
})
export class VideoStreamComponent implements OnDestroy, AfterViewInit {
  @ViewChild('videoCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private socket: WebSocket | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private decoder: VideoDecoder | null = null;

  constructor() {
    this.initializeDecoder();
    this.connectWebSocket();
  }

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private initCanvas(): void {
    if (this.canvasRef) {
      const canvas = this.canvasRef.nativeElement;
      this.ctx = canvas.getContext('2d');
    }
  }

  private initializeDecoder(): void {
    this.decoder = new VideoDecoder({
      output: (frame: any) => {
        if (this.ctx) {
          this.ctx.drawImage(frame, 0, 0, 640, 480);
        }
        frame.close();
      },
      error: (err: any) => {
        console.error('Video decoder error:', err);
      }
    });

    this.decoder.configure({
      codec: 'avc1.42E01E',
      hardwareAcceleration: 'prefer-software'
    });
  }

  private connectWebSocket(): void {
    if (!this.socket) {
      this.socket = new WebSocket(environment.streamBaseURL);
      this.socket.binaryType = 'arraybuffer';

      this.socket.onmessage = (event) => {
        try {
          const chunk = new EncodedVideoChunk({
            type: 'key',
            timestamp: performance.now(),
            data: new Uint8Array(event.data)
          });

          if (this.decoder) {
            this.decoder.decode(chunk);
          } else {
            console.error('Decoder is not initialized');
          }
        } catch (err) {
          console.error('Error while decoding chunk:', err);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }
  }

  private cleanup(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
      this.socket = null;
    }

    if (this.decoder) {
      this.decoder.close();
      this.decoder = null;
    }
  }
}
