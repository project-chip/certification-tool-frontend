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
import { AfterViewInit, ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { TestRunAPI } from 'src/app/shared/core_apis/test-run';
import { ProjectsAPI } from 'src/app/shared/core_apis/project';
import { TestSandbox } from '../test/test.sandbox';
import { SharedAPI } from 'src/app/shared/core_apis/shared';

@Component({
  selector: 'app-utility-category',
  templateUrl: './utility-category.component.html',
  styleUrls: ['./utility-category.component.scss']
})

@Injectable()
export class UtilityCategoryComponent implements AfterViewInit, OnInit {
  constructor(public testRunAPI: TestRunAPI, public projectsAPI: ProjectsAPI, public testSandBox: TestSandbox,
    public sharedAPI: SharedAPI, public changeDetectorRef: ChangeDetectorRef) {
    this.sharedAPI.setUtilityIndex(0); // Pre-select File Upload tab
  }

  tabViewChange(event: any) {
    this.sharedAPI.setUtilityIndex(event.index);
    if (event.index === 0) {
      this.sharedAPI.setTestReportData('');
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }
}
