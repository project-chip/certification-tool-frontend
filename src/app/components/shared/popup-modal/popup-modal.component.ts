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

import { Component, Input } from '@angular/core';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { DEFAULT_POPUP_OBJECT } from 'src/app/shared/utils/constants';
import { DataService } from 'src/app/shared/web_sockets/ws-config';
import { WebRTCService } from 'src/app/shared/core_apis/webrtc.service';

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.scss']
})
export class PopupModalComponent {
  @Input() popupId!: string;
  @Input() header!: string;
  @Input() subHeader!: string;
  @Input() buttons!: any;
  @Input() inputItems!: any;
  @Input() messageId!: any;
  fileName: any = '';
  file?: File;
  sessions$ = this.webRTCService.sessions$;

  constructor(
    public sharedAPI: SharedAPI,
    private dataService: DataService,
    private webRTCService: WebRTCService
  ) {
      this.fileName = '';
  }

  cancel(event: any): void {
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

  isWebRTCStream(): boolean {
    return this.popupId.includes('TWO_WAY_TALK_');
  }

  isVideoStream(): boolean {
    return this.popupId.includes('STREAM_');
  }

  isSnapshot(): boolean {
    return this.popupId.includes('IMAGE_');
  }

  isPushAV(): boolean {
    return this.popupId.includes('PUSH_');
  }
}
