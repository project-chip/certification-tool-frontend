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
import { TestSandbox } from '../../../test/test.sandbox';

@Component({
  selector: 'app-create-new-performance-test-run',
  templateUrl: './create-new-performance-test-run.component.html',
  styleUrls: ['./create-new-performance-test-run.component.scss']
})
export class CreateNewPerformanceTestRunComponent {
  isImportingTestRuns = false;

  constructor(public sharedAPI: SharedAPI,
    private testRunAPI: TestRunAPI,
    public sharedService: SharedService,
    public testSandbox: TestSandbox) { }

  createNewProject() {
    this.sharedAPI.setIsPerformanceTypeSelected(1);
  }
}
