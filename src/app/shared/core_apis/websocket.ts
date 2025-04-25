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

import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { TestExecutionSandbox } from 'src/app/components/test/test-execution/test-execution.sandbox';
import { APP_STATE, EXECUTION_STATUS_COMPLETED } from '../utils/constants';
import { DataService } from '../web_sockets/ws-config';
import { SharedAPI } from './shared';
import { TestRunAPI } from './test-run';
import * as _ from 'lodash';
import { SharedService } from './shared-utils';

@Injectable({ providedIn: 'root' })
export class WebSocketAPI {
  dataSubscription: Subscription | undefined;
  constructor(private testRunAPI: TestRunAPI, private dataService: DataService, public sharedAPI: SharedAPI,
    private sharedService: SharedService, public testExecutionSandbox: TestExecutionSandbox) { }

  async socketSubscription() {
    if (!this.dataSubscription) {
      // Use websocket to stream the logs
      this.dataSubscription = await this.dataService.messages$.subscribe(
        (data: any) => {
          const dataObject = JSON.parse(data);
          if (dataObject.type === 'test_update') {
            this.updateBufferData(dataObject);
            const runningTestcase = this.testRunAPI.getRunningTestCases();
            const updated = this.testExecutionSandbox.updateJSONBasedOnWebSocketData(runningTestcase, dataObject);
            this.testRunAPI.setRunningTestCases(updated);
            this.checkExecutionEnded(dataObject);
          } else if (dataObject.type === 'prompt_request' ||
            dataObject.type === 'options_request' ||
            dataObject.type === 'message_request' ||
            dataObject.type === 'file_upload_request' ||
            dataObject.type === 'stream_verification_request' ||
            dataObject.type === 'image_verification_request' ||
            dataObject.type === 'custom_upload') {
            this.testExecutionSandbox.showExecutionPrompt(dataObject);
          } else if (dataObject.type === 'time_out_notification') {
            this.sharedService.setToastAndNotification({ status: 'error', summary: 'Error!', message: 'Failed to give input' });
            this.sharedAPI.setShowCustomPopup('');
          } else if (dataObject.type === 'test_log_records') {
            if (this.sharedAPI.getWebSocketLoader() === true) {
              this.sharedAPI.setWebSocketLoader(false);
            }
            const logs = _.cloneDeep(this.testRunAPI.getTestLogs());
            logs.push(...dataObject.payload);
            this.testRunAPI.setTestLogs(logs);
          }
        });
    }
  }

  updateBufferData(dataObject: any) {
    if (this.sharedAPI.getExecutionStatus().state === '') {
      const updatedData = [...this.sharedAPI.getbufferWSData(), dataObject];
      this.sharedAPI.setbufferWSData(updatedData);
    } else if (this.sharedAPI.getbufferWSData().length && this.sharedAPI.getExecutionStatus().state === 'running') {
      this.sharedAPI.getbufferWSData().forEach((wsData: any) => {
        const runningTestcase = this.testRunAPI.getRunningTestCases();
        const updated = this.testExecutionSandbox.updateJSONBasedOnWebSocketData(runningTestcase, wsData);
        this.testRunAPI.setRunningTestCases(updated);
      });
      this.sharedAPI.setbufferWSData([]);
    }
  }

  checkExecutionEnded(dataObject: any) {
    // TODO: BE having issue only with Sample tests to send the "Test Run" details in Websocket, So We are checking "Test Suite"
    const state = dataObject.payload.body.state;
    const executionCompleted = EXECUTION_STATUS_COMPLETED.includes(state);
    const isTestRunType = dataObject.payload.test_type === 'Test Run';
    if (isTestRunType && executionCompleted) {
      this.sharedAPI.setAppState(APP_STATE[0]);
      this.sharedService.setToastAndNotification({ status: 'success', summary: 'Success!', message: 'Test execution completed' });
    }
  }

}
