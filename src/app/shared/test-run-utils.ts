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
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getBaseUrl } from 'src/environments/environment';
import { getTimeStamp } from './utils/utils';

@Injectable()
export class TestRunService {
  constructor(private http: HttpClient) { }

  getRunningTestsJson(): Observable<any> {
    return this.http.get(getBaseUrl() + 'running-testcases');
  }
  getTestLogs() {
    return this.http.get(getBaseUrl() + 'test-logs');
  }
  async getTestExecutionResult(isArchived: any, projectId: any, skipLimit: any) {
    return await this.http.get(getBaseUrl() + 'test_run_executions/?archived=' + isArchived + '&project_id=' +
      projectId + '&skip=' + skipLimit + '&limit=250');
  }
  getDefaultTestCases(): Observable<any> {
    return this.http.get(getBaseUrl() + 'test_collections');
  }
  createTestRunExecution(selectedDataFinal: any, selectedProjectId: number, testName: string, operatorId: any,
    description: any): Observable<any> {
    /* eslint-disable @typescript-eslint/naming-convention */
    const selected_tests = selectedDataFinal.selected_tests;
    const requestJson = {
      'test_run_execution_in':
      {
        'title': testName + '_' + getTimeStamp(),
        'project_id': selectedProjectId,
        'description': description,
        'operator_id': operatorId
      },
      selected_tests
    };
    /* eslint-enable @typescript-eslint/naming-convention */
    return this.http.post(getBaseUrl() + 'test_run_executions', requestJson);
  }
  repeatTestRunExecution(testExecutionId: number): Observable<any> {
    return this.http.post(getBaseUrl() + `test_run_executions/${testExecutionId}/repeat`, {});
  }
  startTestRunExecution(id: number): Observable<any> {
    return this.http.post(getBaseUrl() + 'test_run_executions/' + id + '/start', {});
  }
  readTestRunExecution(id: number): Observable<any> {
    return this.http.get(getBaseUrl() + 'test_run_executions/' + id, {});
  }
  async readTestRunExecutionAsync(id: number) {
    return await this.http.get(getBaseUrl() + 'test_run_executions/' + id, {}).toPromise();
  }
  abortTestExecution(): Observable<any> {
    return this.http.post(getBaseUrl() + 'test_run_executions/abort-testing', {});
  }
  getOperatorData() {
    return this.http.get(getBaseUrl() + 'operators/');
  }
  setOperatorData(operator: any) {
    return this.http.post(getBaseUrl() + 'operators', { 'name': operator });

  }
  deleteOperator(operator: any) {
    return this.http.delete(getBaseUrl() + 'operators/' + operator.id);
  }
  updateOperator(data: any) {
    return this.http.put(getBaseUrl() + 'operators/' + data.id, { 'name': data.name });
  }
  archiveTestRun(id: any) {
    return this.http.post(getBaseUrl() + 'test_run_executions/' + id + '/archive', {});
  }
  unarchiveTestRun(id: any) {
    return this.http.post(getBaseUrl() + 'test_run_executions/' + id + '/unarchive', {});
  }
  deleteTestRun(id: any) {
    return this.http.delete(getBaseUrl() + 'test_run_executions/' + id);
  }
  searchTestExecutionHistory(searchQuery: any, isArchived: any, projectId: any) {
    return this.http.get(getBaseUrl() + 'test_run_executions/?archived=' + isArchived +
      '&project_id=' + projectId + '&search_query=' + searchQuery);
  }
  fileUpload(data: File) {
    // eslint-disable-next-line prefer-const
    let formData: FormData = new FormData();
    formData.append('file', data, data.name);
    return this.http.post(getBaseUrl() + 'test_run_executions/file_upload/', formData);
  }
  getLogs(logId: any, json: any) {
    return this.http.get(getBaseUrl() + 'test_run_executions/' + logId + '/log?json_entries=' + json, { responseType: 'text' });
  }
  getApplicableTestCases(data: any) {
    return this.http.get(getBaseUrl() + 'projects/' + data + '/applicable_test_cases');
  }

  async getExecutionStatus() {
    return await this.http.get(getBaseUrl() + 'test_run_executions/status').toPromise();
  }
  importTestRun(file: File, projectId: number) {
    const formData: FormData = new FormData();
    formData.append('import_file', file, file.name);
    return this.http.post(getBaseUrl() + `test_run_executions/import?project_id=${projectId}`, formData);
  }
  exportTestRun(data: any, download: boolean) {
    return this.http.get(getBaseUrl() + `test_run_executions/${data.id}/export?download=${download}`);
  }
  downloadGroupedLogs(data: any) {
    return this.http.get(getBaseUrl() + `test_run_executions/${data.id}/grouped-log`, { responseType: 'blob' });
  }
}
