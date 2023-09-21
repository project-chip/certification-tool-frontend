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
import { Component, DoCheck, OnDestroy } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TestSummarySandbox } from './test-summary.sandbox';
@Component({
  selector: 'app-test-summary',
  templateUrl: './test-summary.component.html',
  styleUrls: ['./test-summary.component.scss']
})
export class TestSummaryComponent implements DoCheck {
  treeData: TreeNode[] = [];
  lastChanges = true;
  constructor(public testSummary: TestSummarySandbox) { }
  // it is a hook, get triggered when value changes
  ngDoCheck() {
    if (this.lastChanges !== this.testSummary.getOnClickChanges()) {
      this.treeData = this.testSummary.selectedDataSummary();
    }
    this.lastChanges = this.testSummary.getOnClickChanges();
  }
}
