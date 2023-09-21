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
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Injectable } from '@angular/core';
import { observable, action } from 'mobx';

@Injectable({ providedIn: 'root' })
export class TestRunStore {
  @observable runningTestCases = [];
  @action setRunningTestCases(runningTestCases: any) {
    this.runningTestCases = runningTestCases;
  }
  @observable runningTestCasesRawData: any = [];
  @action setRunningTestCasesRawData(runningTestCasesRawData: any) {
    this.runningTestCasesRawData = runningTestCasesRawData;
  }
  @observable testExecutionResult: any = [];
  @action setTestExecutionResult(testExecutionResult: any) {
    this.testExecutionResult = testExecutionResult;
  }
  @observable runTestCases: any = [];
  @action setRunTestCases(runTestCases: any) {
    this.runTestCases = runTestCases;
  }
  @observable testCaseQuery: any = '';
  @action setTestCaseQuery(testCaseQuery: any) {
    this.testCaseQuery = testCaseQuery;
  }
  @observable selectedTestCase: any[] = [];
  @action setSelectedTestCase(selectedData: any) {
    this.selectedTestCase = selectedData;
  }
  @observable lastChecked = 0;
  @action setLastChecked(lastChecked: number) {
    this.lastChecked = +lastChecked;
  }
  @observable onClickChange = false;
  @action setOnClickChanges() {
    this.onClickChange = !this.onClickChange;
  }
  @observable testScreen = 2;
  @action setTestScreen(value: any) {
    this.testScreen = value;
  }
  @observable testSuiteCategory: any = [];
  @action setTestSuiteCategory(data: any) {
    this.testSuiteCategory = data;
  }
  @observable currentTestCategory = 1;
  @action setCurrentTestCategory(currentTestCategory: number) {
    this.currentTestCategory = currentTestCategory;
  }
  @observable testLogs: any = [];
  @action setTestLogs(testLogs: any) {
    this.testLogs = testLogs;
  }
  @observable logsFilterKey = '';
  @action setLogsFilterKey(logsFilterKey: string) {
    this.logsFilterKey = logsFilterKey;
  }
  @observable operators: any = [];
  @action setOperators(operators: any) {
    this.operators = operators;
  }
  @observable selectedOperator: any = '';
  @action setSelectedOperator(selectedOperator: any) {
    this.selectedOperator = selectedOperator;
  }
  @observable archivedTestResult: any = [];
  @action setArchivedTestResult(data: any) {
    this.archivedTestResult = data;
  }
  @observable highlightedLog = 0;
  @action setHighlightedLog(value: any) {
    this.highlightedLog = value;
  }
  @observable detectPicsChanges: any = [];
  @action setDetectPicsChanges(data: any) {
    this.detectPicsChanges = data;
  }
}
