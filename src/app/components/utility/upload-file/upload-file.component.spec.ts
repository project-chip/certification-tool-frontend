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
import { TestBed } from '@angular/core/testing';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { SharedService } from 'src/app/shared/core_apis/shared-utils';
import { UploadFileComponent } from './upload-file.component';

class MockUploadFile {
  returnData() {
    return [];
  }
}

describe('UploadFileComponent', () => {
  let component: UploadFileComponent;
  let sharedAPI, sharedService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UploadFileComponent,
        { provide: SharedAPI, useClass: MockUploadFile },
        { provide: SharedService, useClass: MockUploadFile }
      ]
    })
      .compileComponents();
    component = TestBed.inject(UploadFileComponent);
    sharedAPI = TestBed.inject(SharedAPI);
    sharedService = TestBed.inject(SharedService);
  });

  it('should create UploadFileComponent', () => {
    expect(component).toBeTruthy();
    expect(component.onUpload).toBeTruthy();
  });
});
