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
import { Component, OnInit } from '@angular/core';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { SharedService } from 'src/app/shared/core_apis/shared-utils';
import { TestRunAPI } from 'src/app/shared/core_apis/test-run';
import { WebSocketAPI } from 'src/app/shared/core_apis/websocket';
import { APP_STATE } from 'src/app/shared/utils/constants';
import { TestSandbox } from '../test.sandbox';
import { MainAreaSandbox } from '../../main-area/main-area.sandbox';

@Component({
  selector: 'app-test-execution',
  templateUrl: './test-execution.component.html',
  styleUrls: ['./test-execution.component.scss']
})
export class TestExecutionComponent implements OnInit {
  buttons: any;
  inputItems: any;
  appState = APP_STATE;
  abortClicked = false;
  constructor(public sharedAPI: SharedAPI, public testSandBox: TestSandbox, public mainAreaSandbox: MainAreaSandbox,
    public webSocketAPI: WebSocketAPI, private testRunAPI: TestRunAPI, public sharedService: SharedService) { }
  onAbort() {
    this.sharedAPI.setShowCustomPopup('ABORT');
  }
  async onFinish() {
    this.sharedService.cursorBusy(true);
    await this.testRunAPI.getTestExecutionResult(false, this.sharedAPI.getSelectedProjectType().id);
    await this.testRunAPI.getTestExecutionResult(true, this.sharedAPI.getSelectedProjectType().id);
    this.sharedService.cursorBusy(false);
    this.testRunAPI.setRunningTestCasesRawData([]);
    this.testRunAPI.setRunningTestCases([]);
    this.testRunAPI.setTestLogs([]);
    if (this.mainAreaSandbox.fetchCurrentIndex() === 1) {
      this.testSandBox.setTestScreen(2);
    } else if (this.mainAreaSandbox.fetchCurrentIndex() === 6) {
      this.testSandBox.setPerformanceTestScreen(2);
    }
  }
  onYesClick() {
    this.abortClicked = true;
    this.sharedAPI.setShowCustomPopup('');
    const newTestRun: any = this.testRunAPI.getRunningTestCasesRawData();
    this.testRunAPI.abortTestExecAndUpdateTestcase(newTestRun.id);
    this.sharedAPI.setAppState(APP_STATE[1]);
  }
  onNoClick() {
    this.sharedAPI.setShowCustomPopup('');
  }

  ngOnInit(): void {
    this.buttons = [
      { id: 0, label: 'No', class: 'buttonNo', iconClass: 'pi pi-times', callback: this.onNoClick.bind(this) },
      { id: 1, label: 'Yes', class: 'buttonYes', iconClass: 'pi pi-check', callback: this.onYesClick.bind(this) }
    ];
  }

}
