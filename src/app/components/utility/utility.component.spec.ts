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
import { DatePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { MainAreaSandbox } from '../main-area/main-area.sandbox';
import { UtilityComponent } from './utility.component';

class MockUtilityProvider {
  // sets the uploaded JOSN file
  setTestReportData() {

  }
  returnData() {
    return [];
  }
}
describe('UtilityComponent', () => {
  let component: UtilityComponent;
  let mainAreaSandbox, sharedAPI, date;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UtilityComponent,
        { provide: SharedAPI, useClass: MockUtilityProvider },
        { provide: MainAreaSandbox, useClass: MockUtilityProvider },
        { provide: DatePipe }
      ]
    })
      .compileComponents();
    component = TestBed.inject(UtilityComponent);
    mainAreaSandbox = TestBed.inject(MainAreaSandbox);
    sharedAPI = TestBed.inject(SharedAPI);
    date = TestBed.inject(DatePipe);
  });
});
