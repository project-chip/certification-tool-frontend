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
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { SharedService } from 'src/app/shared/core_apis/shared-utils';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  data: any = '';
  fileName = '';
  fileSize = '';
  constructor(public sharedAPI: SharedAPI, public sharedService: SharedService) { }

  onUpload(event: any) {
    const file: File = event.target.files.item(0);
    if (file.type === 'application/json') {
      this.fileName = file.name;
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.data = fileReader.result;
        this.sharedAPI.setTestReportData(JSON.parse(this.data));
      };
      fileReader.readAsText(file);
    } else {
      this.sharedService.setToastAndNotification({ status: 'error', summary: 'Error!', message: 'Upload a valid JSON file' });
    }
  }
}
