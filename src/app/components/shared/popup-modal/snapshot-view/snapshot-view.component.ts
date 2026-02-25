/**
 * * Copyright (c) 2026 Project CHIP Authors
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

import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { commaSeparatedHexToBase64 } from '../utils';

@Component({
  selector: 'app-snapshot-view',
  templateUrl: './snapshot-view.component.html',
  styleUrls: ['./snapshot-view.component.scss']
})
export class SnapshotViewComponent implements AfterViewInit {
  @ViewChild('imageView') imageRef!: ElementRef<HTMLImageElement>;

  constructor(private sharedAPI: SharedAPI) {}

  ngAfterViewInit(): void {
    const data = this.sharedAPI.getCustomPopupData();
    if (data.imgHexStr) {
      const imgHexStr = data.imgHexStr;
      const byteStream = commaSeparatedHexToBase64(imgHexStr);
      this.imageRef.nativeElement.src = `data:image/jpg;base64,${byteStream}`;
    }
  }
}
