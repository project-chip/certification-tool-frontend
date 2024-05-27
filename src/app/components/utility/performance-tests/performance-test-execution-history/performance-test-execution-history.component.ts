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
import { Component, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { testExecutionTable, TestRunAPI } from 'src/app/shared/core_apis/test-run';
import { TestSandbox } from '../../../test/test.sandbox';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { APP_STATE } from 'src/app/shared/utils/constants';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { SharedService } from 'src/app/shared/core_apis/shared-utils';
import { UploadFileComponent } from '../../upload-file/upload-file.component';

@Component({
  selector: 'app-performance-test-execution-history',
  templateUrl: './performance-test-execution-history.component.html',
  styleUrls: ['./performance-test-execution-history.component.scss'],
})

@Injectable()
export class PerformanceTestExecutionHistoryComponent {

  testExecutionDropDown: any = testExecutionTable();
  selectedDropdownData = this.testExecutionDropDown[0];
  isSearch = false;
  ref?: DynamicDialogRef;
  searchQuery = '';
  isImportingTestRuns = false;
  constructor(public testSandbox: TestSandbox, public sanitizer: DomSanitizer, public sharedService: SharedService,
    public sharedAPI: SharedAPI, public dialogService: DialogService, private testRunAPI: TestRunAPI) {
    sanitizer.bypassSecurityTrustStyle('--bper');
  }
  mystyle(data: any): string {
    const states: any = {};
    let percent = 0;
    if (data.test_case_count > 0) {
      percent = 100 / data.test_case_count;
    }
    states['passed'] = (data.states.passed || 0) * percent;
    states['failed'] = (data.states.failed || 0) * percent + states.passed;
    states['error'] = (data.states.error || 0) * percent + states.failed;
    states['cancelled'] = (data.states.cancelled || 0) * percent + states.error;
    states['pending'] = (data.states.pending || 0) * percent + states.cancelled;
    const final = '--percent-passed:' + states.passed + '%; --percent-failed:' + states.failed + '%; --percent-error:'
      + states.error + '%; --percent-cancelled:' + states.cancelled + '%; --percent-pending:' + states.pending + '%;';
    return final;
  }
  filterProjectId() {
    let filterData = [];
    if (this.isSearch) {
      document.getElementById('testsearch')?.focus();
    }
    if (this.selectedDropdownData.tableName === 'Test' && this.testSandbox.getTestExecutionResult().length) {
      filterData = this.testSandbox.getTestExecutionResult();
    } else if (this.testSandbox.getTestExecutionResult().length === 0 && this.selectedDropdownData.tableName === 'Test') {
      this.selectedDropdownData = this.testExecutionDropDown[1];
      filterData = this.testSandbox.getArchivedTestResult();
    } else {
      filterData = this.testSandbox.getArchivedTestResult();
    }

    if (filterData.length) {
      this.sharedAPI.setIsPerformanceTypeSelected(1);
      return filterData.reverse();
    } else {
      if (this.isSearch === false && this.testSandbox.getTestExecutionResult().length === 0 &&
        this.testSandbox.getArchivedTestResult().length === 0) {
        this.sharedAPI.setIsPerformanceTypeSelected(0);
        this.testSandbox.setPerformanceTestScreen(0);
      }
      return filterData;
    }
  }
  newTestRun() {
    this.testSandbox.setPerformanceTestScreen(0);
  }
  importTestRun(event: any) {
    const projectId = this.sharedAPI.getSelectedProjectType().id;
    const totalFiles = event.target.files.length;
    let processedFilesCount = 0;
    this.isImportingTestRuns = true;

    for (let i = 0; i < totalFiles; i++) {
      const file: File = event.target.files.item(i);
      if (file.type === 'application/json') {
        this.testRunAPI.importTestRun(file, projectId).subscribe(() => {
          processedFilesCount++;
          if (processedFilesCount === totalFiles) {
            this.testSandbox.getTestExecutionResults(projectId);
            this.sharedService.setToastAndNotification({
              status: 'success',
              summary: 'Success!',
              message: 'File(s) imported successfully'
            });
            this.isImportingTestRuns = false;
          }
        }, () => {
          this.sharedService.setToastAndNotification({
            status: 'error',
            summary: 'Error!',
            message: 'Something went wrong importing the test run execution file'
          });
          this.isImportingTestRuns = false;
        });
      } else {
        this.sharedService.setToastAndNotification({
          status: 'error',
          summary: 'Error!',
          message: 'Invalid test run execution file'
        });
        this.isImportingTestRuns = false;
      }
    }
  }
  exportTestRun(data: any) {
    const download = true;
    this.testRunAPI.exportTestRun(data, download).subscribe(responseObj => {
      const response: any = responseObj;
      const jsonStr = JSON.stringify(response);
      const file = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      saveAs(file, `${response.test_run_execution.title}.json`);
      this.sharedService.setToastAndNotification({
        status: 'success',
        summary: 'Success!',
        message: 'Test run exported successfully'
      });
    }, () => {
      this.sharedService.setToastAndNotification({
        status: 'error',
        summary: 'Error!',
        message: 'Test run export failed'
      });
    });
  }
  downloadGroupedLogs(data: any) {
    this.testRunAPI.downloadGroupedLogs(data).subscribe(responseObj => {
      const response: any = responseObj;
      const fileName = `${arguments[0].title}.zip`;
      const file = new Blob([response], { type: 'application/zip;charset=utf-8' });
      saveAs(file, fileName);
      this.sharedService.setToastAndNotification({
        status: 'success',
        summary: 'Success!',
        message: 'Grouped logs downloaded successfully'
      });
    }, (err) => {
      this.sharedService.setToastAndNotification({
        status: 'error',
        summary: 'Error!',
        message: 'Grouped logs download failed'
      });
    });
  }
  testHistorySearch() {
    this.isSearch = true;
    if (this.selectedDropdownData.tableName === 'Test') {
      this.testRunAPI.searchTestExecutionHistory(this.searchQuery, false);
    } else {
      this.testRunAPI.searchTestExecutionHistory(this.searchQuery, true);
    }
  }
  checkSearchLength(data: any) {
    if (data.length === 0) {
      if (this.selectedDropdownData.tableName === 'Test') {
        this.testRunAPI.searchTestExecutionHistory('', false);
      } else {
        this.testRunAPI.searchTestExecutionHistory('', true);
      }
      this.isSearch = false;
    }
  }
  showTestReport(reportId: any) {
    if (environment.isMockActive) {
      this.testRunAPI.getMockReport();
    } else {
      this.testRunAPI.getTestReportData(reportId, 0);
    }
    this.ref = this.dialogService.open(UploadFileComponent, {
      width: '100%',
      baseZIndex: 10000,
      styleClass: 'report-dialog'
    });
  }
  downloadTestReport(reportId: any) {
    this.testRunAPI.getTestReportData(reportId, this.saveTestReport.bind(this));
  }

  saveTestReport() {
    const reportData = this.sharedAPI.getTestReportData();
    const reportDataStr = JSON.stringify(reportData);
    const file = new Blob([reportDataStr], { type: 'text/plain;charset=utf-8' });
    saveAs(file, reportData.title + '-' + reportData.id.toString() + '.json');
  }

  downloadTestLog(data: any) {
    this.testRunAPI.getLogs(data.id, this.saveLogs.bind(this, data.title), false);
  }
  showExecutionPage(reportId: any) {
    this.testRunAPI.setRunningTestCasesRawData([]);
    this.testRunAPI.setRunningTestCases([]);
    this.testRunAPI.setTestLogs([]);
    this.testSandbox.setPerformanceTestScreen(1);
    if (environment.isMockActive) {
      this.testRunAPI.getRunningTestsData();
    } else {
      this.testRunAPI.readRunningTestsRawData(reportId, this.testRunAPI.updateRunningTestcase.bind(this.testRunAPI));
    }
  }
  repeatTestRun(executionData: any) {
    this.testSandbox.setPerformanceTestScreen(1);
    if (environment.isMockActive) {
      this.testRunAPI.getRunningTestsData();
    } else {
      const title: any = executionData.title.slice(0, executionData.title.length - 20);
      this.sharedAPI.setAppState(APP_STATE[1]);
      this.sharedAPI.setWebSocketLoader(true);
      this.testSandbox.repeatTestRunExecution(this.repeatExecution.bind(this), executionData.id);
    }
  }
  repeatExecution(execId: any) {
    this.testSandbox.setRunningTestsDataOnStart(execId);
  }
  archiveTestRun(id: any) {
    if (this.selectedDropdownData.tableName === 'Test') {
      this.testSandbox.archiveTestRun(id);
    } else {
      this.testSandbox.unarchiveTestRun(id);
    }
  }

  deleteTestRun(id: any) {
    this.testSandbox.deleteTestRun(id);
  }
  saveLogs(title: any, data: any) {
    const file = new Blob([data], { type: 'text/plain;charset=utf-8' });
    saveAs(file, title + '.log');
  }
}


