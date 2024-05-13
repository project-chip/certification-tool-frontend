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
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
import { Component, OnDestroy } from '@angular/core';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { TestRunAPI } from 'src/app/shared/core_apis/test-run';
import { APP_STATE } from 'src/app/shared/utils/constants';
import { TestSandbox } from '../../test/test.sandbox';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/shared/core_apis/shared-utils';
import { TestRunStore } from 'src/app/store/test-run-store';
import * as _ from 'lodash';

@Component({
    selector: 'performance-tests',
    templateUrl: './performance-tests.component.html',
    styleUrls: ['./performance-tests.component.scss']
  })
export class PerformanceTestsComponent implements OnDestroy {
    searchQuery: any = '';
    constructor(public testSandbox: TestSandbox, public sharedAPI: SharedAPI,
        public testRunAPI: TestRunAPI, public sharedService: SharedService, public testRunStore: TestRunStore) {
        testRunAPI.getApplicableTestCases(this.sharedAPI.getSelectedProjectType().id, this.setDefaultPicsData.bind(this));
        this.onTestSearch();
      }
    // to find the number of selectedtestcases
    getSelectedTestCase(index: number) {
      let count = 0;
      this.testSandbox.getSelectedData()[index].forEach((data: any, dataIndex: number) => {
        if (data && data.children.length === this.testSandbox.getRunTestCaseData()[index][dataIndex].children.length) {
          count++;
        }
      });
      return count;
    }
    // to set the current test category tab
    testCategoryClicked(category: any) {
      this.testSandbox.setCurrentTestCategory(category);
    }
    // search
    onTestSearch() {
      const filteredData = this.testSandbox.getRunTestCaseData();
      this.searchQuery = (this.searchQuery).toLowerCase();
      this.testSandbox.getRunTestCaseData().forEach((data: any, index: any) => {
        data.forEach((testSuite: any, testSuiteIndex: any) => {
          testSuite.children.forEach((testCase: any, testCaseIndex: any) => {
            const title = testCase.title.toLowerCase();
            filteredData[index][testSuiteIndex].children[testCaseIndex]['filtered'] = false;
            if (title.includes(this.searchQuery)) {
              filteredData[index][testSuiteIndex].children[testCaseIndex]['filtered'] = true;
            }
          });
  
        });
      });
      this.testSandbox.setTestCaseQuery(this.searchQuery);
      this.testSandbox.setFilteredData(filteredData);
    }
  
    scrollNavbar(data: any) {
      const ele = document.querySelector('.testcase-custom-view ul');
  
      if (ele && data === 'R') {
        ele.scrollLeft += 20;
      } else if (ele && data === 'L') {
        ele.scrollLeft -= 20;
      }
    }
    isNavbar(data: any) {
      const ele = document.querySelector('.testcase-custom-view ul');
      let isScroll = false;
  
      if (ele?.scrollLeft === 0 && data === 'RC') {
        ele.scrollLeft += 1;
        if (ele.scrollLeft > 0) {
          ele.scrollLeft = 0;
          isScroll = true;
        }
      } else if (ele && ele.scrollLeft > 0) {
        isScroll = true;
      }
      return isScroll;
    }
    ngOnDestroy() {
      this.testSandbox.setCurrentTestCategory(0);
    }
  selectedDataFinal: any = {};
  testName = 'UI_Test_Run';
  description = '';
  allowedCharacter = /[^A-Za-z0-9 _-]/;

  setDefaultPicsData(data: any) {
    const selectedData = _.cloneDeep(this.testRunStore.selectedTestCase);
    const defaultTestCase = _.cloneDeep(this.testSandbox.getRunTestCaseData());
    // eslint-disable-next-line prefer-const
    let detectPicsChanges: any = [];
    defaultTestCase.forEach((category: any, categoryIndex: any) => {
      detectPicsChanges[categoryIndex] = '';
      category.forEach((testSuite: any, testSuiteIndex: any) => {
        testSuite.children.forEach((testCase: any) => {
          data.test_cases.find((e: any) => {
            if (testCase.title === e) {
              if (selectedData[categoryIndex][testSuiteIndex]) {
                selectedData[categoryIndex][testSuiteIndex].children.push(testCase);
              } else {
                selectedData[categoryIndex][testSuiteIndex] = testSuite;
                selectedData[categoryIndex][testSuiteIndex].children = [];
                detectPicsChanges[categoryIndex] = true;
                selectedData[categoryIndex][testSuiteIndex].children.push(testCase);
              }
            }
          });
        });
      });
    });
    this.testRunStore.setSelectedTestCase(selectedData);
    this.testSandbox.setOnClickChanges();
    this.testRunStore.setDetectPicsChanges(detectPicsChanges);
  }
  // build's final data as object
  async onTestStart() {
    if (environment.isMockActive) {
      if (!this.testRunAPI.getSelectedOperator()) {
        this.sharedService.setToastAndNotification({ status: 'error', summary: 'Error!', message: 'Select a operator' });
      } else {
        this.testSandbox.setPerformanceTestScreen(1);
        this.testRunAPI.getRunningTestsData();
      }
    } else {
      if (!this.testRunAPI.getSelectedOperator()) {
        this.sharedService.setToastAndNotification({ status: 'error', summary: 'Error!', message: 'Select a operator' });
      } else if (!this.isTestCaseSelected() && !this.isWarningExist()) {
        this.sharedAPI.setWebSocketLoader(true);
        this.sharedService.setToastAndNotification({ status: 'success', summary: 'Success!', message: 'Test execution started' });
        this.sharedAPI.setAppState(APP_STATE[1]);
        this.testRunAPI.setRunningTestCasesRawData([]);
        this.testRunAPI.setRunningTestCases([]);
        this.testRunAPI.setTestLogs([]);
        this.testSandbox.setPerformanceTestScreen(1);
        /* eslint-disable @typescript-eslint/naming-convention */
        this.selectedDataFinal = {
          'name': 'test',
          'dut_name': 'test_dut',
          'selected_tests': {}
        };
        /* eslint-enable @typescript-eslint/naming-convention */
        for (let mainIndex = 0; mainIndex < this.testSandbox.getSelectedData().length; mainIndex++) {
          if (this.testSandbox.getSelectedData()[mainIndex].length > 0) {
            this.selectedDataFinal.selected_tests[this.testSandbox.getTestSuiteCategory()[mainIndex]] = {};
            for (let parentIndex = 0; parentIndex < this.testSandbox.getSelectedData()[mainIndex].length; parentIndex++) {
              if (this.testSandbox.getSelectedData()[mainIndex][parentIndex]) {
                this.selectedDataFinal.selected_tests[this.testSandbox.getTestSuiteCategory()
                [mainIndex]][this.testSandbox.getSelectedData()[mainIndex][parentIndex].public_id] = {};
                this.testSandbox.getSelectedData()[mainIndex][parentIndex].children.forEach((selectedChildren: any) => {
                  this.selectedDataFinal.selected_tests[this.testSandbox.getTestSuiteCategory()[mainIndex]]
                  [this.testSandbox.getSelectedData()[mainIndex][parentIndex].public_id][selectedChildren.public_id] =
                    selectedChildren.count;
                });
              }
            }
          }
        }
        this.testSandbox.createTestRunExecution(
          this.callbackForStartTestExecution.bind(this),
          this.selectedDataFinal,
          this.testName,
          this.testRunAPI.getSelectedOperator().id,
          this.description
        );
      }
    }
  }

  // call back for test execution
  callbackForStartTestExecution(value: any) {
    this.testSandbox.setRunningTestsDataOnStart(value);
  }

  isTestCaseSelected() {
    let selectedSuite = 0;
    this.testSandbox.getSelectedData().forEach((testCategory) => {
      if (testCategory) {
        testCategory.forEach((testSuite: any) => {
          if (testSuite) {
            if (testSuite.children.length > 0) {
              selectedSuite = 1;
            }
          }
        });
      }
    });
    if (selectedSuite === 1) {
      return false;
    } else {
      return true;
    }
  }

  isWarningExist() {     // If Test-run-config input has any warning it will return true
    let returnVal = false;
    if (this.testName === '' || this.allowedCharacter.test(this.testName)) {
      returnVal = true;
    }
    return returnVal;
  }
  clearTestSelection() {
    const emptySelection: any = [];
    for (let index = 0; index < this.testSandbox.getRunTestCaseData().length; index++) {
      emptySelection[index] = [];
    }
    this.testRunStore.setSelectedTestCase(emptySelection);
    this.testSandbox.setOnClickChanges();
  }
}

