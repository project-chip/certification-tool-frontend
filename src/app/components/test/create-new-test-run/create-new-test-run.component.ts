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
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { TestRunAPI } from 'src/app/shared/core_apis/test-run';
import { SharedService } from 'src/app/shared/core_apis/shared-utils';
import { TestSandbox } from '../test.sandbox';

@Component({
  selector: 'app-create-new-test-run',
  templateUrl: './create-new-test-run.component.html',
  styleUrls: ['./create-new-test-run.component.scss']
})
export class CreateNewTestRunComponent {
  isImportingTestRuns = false;

  constructor(public sharedAPI: SharedAPI,
    private testRunAPI: TestRunAPI,
    public sharedService: SharedService,
    public testSandbox: TestSandbox) { }

  createNewProject() {
    this.sharedAPI.setIsProjectTypeSelected(1);
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
            this.testSandbox.setTestScreen(2);
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
}
