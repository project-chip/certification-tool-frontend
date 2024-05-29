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
import { TestRunAPI } from 'src/app/shared/core_apis/test-run';
import { saveAs } from 'file-saver';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { APP_STATE } from 'src/app/shared/utils/constants';
import { SharedService } from 'src/app/shared/core_apis/shared-utils';

@Component({
  selector: 'app-performance-test-log-toolbar',
  templateUrl: './performance-test-log-toolbar.component.html',
  styleUrls: ['./performance-test-log-toolbar.component.scss']
})
export class PerformanceTestLogToolbarComponent {
  appState = APP_STATE;

  constructor(public testRunAPI: TestRunAPI, public sharedAPI: SharedAPI, public sharedService: SharedService) {}
  
  get currentAppState(): string {
    return this.sharedAPI.getAppState();
  }

  // Using Blob save the execution data as file
  saveExecHistoryAsFile() {
    const newTestRun: any = this.sharedAPI.getTestReportData();
    const newTestRunStr = JSON.stringify(newTestRun);
    const file = new Blob([newTestRunStr], { type: 'text/plain;charset=utf-8' });
    saveAs(file, newTestRun.title + '-' + newTestRun.id.toString() + '.json');
    this.sharedService.cursorBusy(false);
  }
  
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  // Open External Tool
  openExternalTool() {
    const newTestRunId:number = this.testRunAPI.getRunningTestCasesRawData().id;
    const projectId:number = this.sharedAPI.getSelectedProjectType().id;


    this.testRunAPI.generate_performance_summary(newTestRunId, projectId);
    console.log("Fim do processamento");

       // Wait 1s in order to summary generation be completed 
       (async () => { 
        await this.delay(2000);
        const newTab = window.open("http://192.168.64.26:60500/home", "_blank");
        newTab?.location.reload();
    })();

  }
  

  // Take latest execution data and download as file
  downloadExecHistory() {
    if (this.currentAppState === APP_STATE[0]) {
      this.sharedService.cursorBusy(true);
      const newTestRun: any = this.testRunAPI.getRunningTestCasesRawData();
      this.testRunAPI.getTestReportData(newTestRun.id, this.saveExecHistoryAsFile.bind(this));
    }
  }

  // Download the logs as file
  downloadTestLogs() {
    if (this.currentAppState === APP_STATE[0]) {
      this.sharedService.cursorBusy(true);
      this.testRunAPI.getLogs(this.testRunAPI.getRunningTestCasesRawData().id, this.saveLogs.bind(this), false);
    }
  }

  onLogsFilterKeyChange(event: any) {
    this.testRunAPI.setLogsFilterKey(event.target.value);
    this.testRunAPI.setHighlightedLog(0);
    const scrollElement: HTMLElement | null = document.querySelector('.log-console-parent .cdk-virtual-scroll-viewport');
    if (scrollElement) {
      scrollElement.scrollTop = 0;
    }
  }

  getFilteredLogsLegth() {
    if (this.testRunAPI.getLogsFilterKey()) {
      return this.testRunAPI.getTestLogs().filter((ele: any) =>
        ele.message.toLowerCase().includes(this.testRunAPI.getLogsFilterKey().toLowerCase())).length;
    } else {
      return this.testRunAPI.getTestLogs().length;
    }
  }

  onLogSearchUpAndDown(type: any) {
    const currentIndex = this.testRunAPI.getHighlightedLog();
    let newIndex = 0;
    const filteredLogsLegth = this.getFilteredLogsLegth();
    if (type === 'DOWN') {
      if (currentIndex === filteredLogsLegth - 1) {
        newIndex = 0;
      } else {
        newIndex = currentIndex + 1;
      }
    } else if (type === 'UP') {
      if (currentIndex === 0) {
        newIndex = filteredLogsLegth - 1;
      } else {
        newIndex = currentIndex - 1;
      }
    }
    this.testRunAPI.setHighlightedLog(newIndex);

    const className = '.logs_tr_index_' + newIndex;
    const highlightedElement: HTMLElement | null = document.querySelector(className);
    const scrollElement: HTMLElement | null = document.querySelector('.log-console-parent .cdk-virtual-scroll-viewport');
    if (highlightedElement) {
      highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (scrollElement) {
      const scrollTopVal = newIndex / filteredLogsLegth * scrollElement.scrollHeight;
      scrollElement.scrollTop = scrollTopVal;
    }
  }

  onKeydown(event: any) {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        this.onLogSearchUpAndDown('UP');
      } else {
        this.onLogSearchUpAndDown('DOWN');
      }
    }
  }
  saveLogs(data: any) {
    const file = new Blob([data], { type: 'text/plain;charset=utf-8' });
    saveAs(file, this.testRunAPI.getRunningTestCasesRawData().title + '.log');
    this.sharedService.cursorBusy(false);
  }
}
