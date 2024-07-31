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
import * as _ from 'lodash';
@Component({
  selector: 'app-test-execution-tree',
  templateUrl: './test-execution-tree.component.html',
  styleUrls: ['./test-execution-tree.component.scss']
})
export class TestExecutionTreeComponent {
  activeBlock: any;
  constructor(public testRunAPI: TestRunAPI, public sharedAPI: SharedAPI) { }

  expandClick(data: any) {
    if (data.children.length) {
      const copyRunningTests = this.testRunAPI.getRunningTestCases();
      const updatedData = this.updateExpanded(copyRunningTests, data.key);
      this.testRunAPI.setRunningTestCases(updatedData);
    }
    if (data.testStepIndex) {
      const logs = _.cloneDeep(this.testRunAPI.getTestLogs());
      const logIndex = logs.map((log: any) =>
        log.test_suite_execution_index + '' + log.test_case_execution_index + '' + log.test_step_execution_index).
        indexOf(data.testStepIndex);
      const logEle = document.getElementsByClassName('test-logs-parent')[0];
      if (logEle.getElementsByClassName('cdk-virtual-scroll-viewport')[0] && logIndex !== -1) {
        logEle.getElementsByClassName('cdk-virtual-scroll-viewport')[0].scrollTop = logIndex * 27;
      }
    }
  }

  keepOriginalOrder = (a: any, b: any) => a.key;

  updateExpanded(testData: any, key: any) {
    testData.some(function iter(ele: any) {
      if (ele.key === key) {
        ele.expanded = !ele.expanded;
        return true;
      }
      return Array.isArray(ele.children) && ele.children.some(iter);
    });
    return testData;
  }

  switchActiveBlock(active: any) {
    if (this.activeBlock === active) {
      this.activeBlock = '';
    } else {
      this.activeBlock = active;
    }
  }

  getAllTestSuits(testCollectionName: any) {
    const testSuitsArr = Object.keys(testCollectionName.value.test_suites);
    return testSuitsArr;
  }

  getFilteredRunningTestCases(testCollection: any) {
    const testSuitsList = this.getAllTestSuits(testCollection);
    const runningTC = this.testRunAPI.getRunningTestCases();
    const filteredRunningTC = runningTC.filter((ele: any) => testSuitsList.includes(ele.name));
    if (this.activeBlock === undefined && filteredRunningTC.length !== 0) {       // This will check only in initially TC execution started
      this.activeBlock = testCollection.key;
    }
    return filteredRunningTC;
  }

  getCategoryProgress(filteredRunningTC: any) {
    let progressSum = 0;
    filteredRunningTC.forEach((ele: any) => {
      progressSum = progressSum + ele.progress;
    });
    return Math.round(progressSum / filteredRunningTC.length);
  }

  getCategoryClassName(data: any) {
    const isPending = data.some((ele: any) => ele.status === 'pending');
    const isExecuting = data.some((ele: any) => ele.status === 'executing');
    const isPassed = data.every((ele: any) => ele.status === 'passed');
    const isNotApplicable = data.some((ele: any) => ele.status === 'not_applicable');
    let className = '';
    let iconTitle = '';
    if (isNotApplicable) {
      className = 'pi pi-angle-double-right not-applicable';
      iconTitle = 'Not Applicable';
    } else if (isExecuting) {
      className = 'pi pi-spin pi-spinner';
      iconTitle = 'Executing';
    } else if (isPassed) {
      className = 'pi pi-check success';
      iconTitle = 'Passed';
    } else if (!isPending) {
      className = 'pi pi-times error';
      iconTitle = 'Error';
    }
    return { className: className, iconTitle: iconTitle };
  }
}
