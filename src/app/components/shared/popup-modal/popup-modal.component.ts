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
import { DEFAULT_POPUP_OBJECT } from 'src/app/shared/utils/constants';
import { DataService } from 'src/app/shared/web_sockets/ws-config';
import { environment } from 'src/environments/environment';
import { convert_hex_to_base64, commaSeparatedHexToBase64 } from './image-utils';

declare class EncodedVideoChunk {
  constructor(chunk: any);
}

type VideoDecoderConfig = {
  codec: string;
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
  private socket!: WebSocket;
  private ctx!: CanvasRenderingContext2D | null;
  private decoder: VideoDecoder | null;

  @ViewChild('videoCanvas', {static: false}) canvasRef!: ElementRef<HTMLCanvasElement>
  @ViewChild('imageView') imageRef!: ElementRef<HTMLImageElement>;

  constructor(public sharedAPI: SharedAPI, private dataService: DataService) {
    this.fileName = '';
    this.decoder = new VideoDecoder({
      output: (frame: any) => {
        if (this.ctx) {
          this.ctx.drawImage(frame, 0, 0, 640, 480);
        }
        frame.close();
      },
      error: (err: any) => {},
    });
    this.decoder.configure({ codec: "avc1.42E01E" });
  }

  ngOnInit(): void {
    if (this.popupId.includes('STREAM_')) {
      this.connectWebSocket();
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
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.close();
    }
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
