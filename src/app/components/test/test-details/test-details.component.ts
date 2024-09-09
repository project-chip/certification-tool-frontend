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
import { Component } from '@angular/core';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { TestRunAPI } from 'src/app/shared/core_apis/test-run';
import { APP_STATE } from 'src/app/shared/utils/constants';
import { TestSandbox } from '../test.sandbox';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/shared/core_apis/shared-utils';
import { TestRunStore } from 'src/app/store/test-run-store';
import * as _ from 'lodash';

@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.scss']
})
export class TestDetailsComponent {
  testName = 'UI_Test_Run';
  description = '';
  allowedCharacter = /[^A-Za-z0-9 _-]/;
  constructor(public testSandbox: TestSandbox, public sharedAPI: SharedAPI,
    public testRunAPI: TestRunAPI, public sharedService: SharedService, public testRunStore: TestRunStore) {
    testRunAPI.getApplicableTestCases(this.sharedAPI.getSelectedProjectType().id, this.setDefaultPicsData.bind(this));
  }

  setDefaultPicsData(applicableTestCases: any) {
    const selectedData = _.cloneDeep(this.testRunStore.selectedTestCase);
    const allTestCases = _.cloneDeep(this.testSandbox.getRunTestCaseData());
    // eslint-disable-next-line prefer-const
    let detectPicsChanges: any = [];
    allTestCases.forEach((category: any, categoryIndex: any) => {
      detectPicsChanges[categoryIndex] = '';
      category.forEach((testSuite: any, testSuiteIndex: any) => {
        testSuite.children.forEach((testCase: any) => {
          applicableTestCases.test_cases.find((e: any) => {
            let applicableTestCaseName = Object.keys(e)[0];
            if (testCase.title === applicableTestCaseName) {
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

    let tgf = this.organizeTestCases(applicableTestCases, allTestCases)

    // this.testRunStore.setSelectedTestCase(selectedData);
    this.testRunStore.setSelectedTestCase(tgf);
    this.testSandbox.setOnClickChanges();
    this.testRunStore.setDetectPicsChanges(detectPicsChanges);
  }

  organizeTestCases(applicableTestCases: any, allTestCases: any[]) {
    let resultArray: any[] = [];

    applicableTestCases.test_cases.forEach((testCaseObj: any) => {
      let testCaseID = Object.keys(testCaseObj)[0];
      let testCaseDetails = testCaseObj[testCaseID];
      let testCollection = testCaseDetails.test_collection;
      let testSuite = testCaseDetails.test_suite;
    
      // Find or create the collection array for this test collection
      let collection = resultArray.find((col: any) => col.some((suiteObj: any) => suiteObj.test_collection === testCollection));
    
      if (!collection) {
        collection = []; // Create a new array for this collection
        resultArray.push(collection);
      }
    
      // Find or create the suite object within the collection array
      let suiteObject = collection.find((suite: any) => suite.test_suite === testSuite);
    
      if (!suiteObject) {
        // Create a new suite object and add it to the collection
        suiteObject = {
          test_suite: testSuite,
          test_collection: testCollection,
          children: []
        };
        collection.push(suiteObject);
      }
    
      // Add the test case to the suite's children
      suiteObject.children.push({
        title: testCaseID
      });
    });


    let newArr = this.mixAndMatchDetails(resultArray, allTestCases);


    return newArr;
}

mixAndMatchDetails(arrayResult: any[], allTestCases: any[]) {
  let newArray: any[] = [];

  // Helper function to find a test suite in allTestCases
  function findTestSuiteDetails(testSuite: any, testCollection: any[]) {
      for (let testCollectionObj of allTestCases) {
          // Iterate over the suites in each collection
          for (let suiteObj of testCollectionObj) {
              // Match both test suite and test collection
              if (suiteObj.title === testSuite /*&& suiteObj.test_collection === testCollection*/) {
                  return suiteObj; // Return matching test suite details
              }
          }
      }
      return null; // If not found, return null
  }

  // Helper function to find a test case in allTestCases
  function findTestCaseDetails(testSuite: any, testCollection: any[], testCaseTitle: string) {
      for (let testCollectionObj of allTestCases) {
          // Iterate over the suites in each collection
          for (let suiteObj of testCollectionObj) {
              // Match both test suite and test collection
              if (suiteObj.title === testSuite /*&& suiteObj.test_collection === testCollection*/) {
                  // Look for the test case within the suite's children
                  for (let child of suiteObj.children) {
                      if (child.title === testCaseTitle) {
                          return child; // Return matching test case details
                      }
                  }
              }
          }
      }
      return null; // If not found, return null
  }

  // Iterate through arrayResult to mix and match details
  arrayResult.forEach(collection => {
      let newCollection: any[] = [];

      collection.forEach((suiteObj: any) => {
          // Find the matching suite details in allTestCases
          let suiteDetails = findTestSuiteDetails(suiteObj.test_suite, suiteObj.test_collection);
          
          if (suiteDetails) {
              // Change test_suite to public_id and define children array with explicit type
              let newSuiteObj = { 
                  ...suiteDetails, // Copy all suite details except children
                  public_id: suiteDetails.title, // Ensure public_id is set
                  test_collection: suiteObj.test_collection, // Keep test_collection
                  children: [] as any[] // Explicitly define the type of children as 'any[]'
              };

              // Iterate through the test cases in the suite
              suiteObj.children.forEach((testCase: any) => {
                  let details = findTestCaseDetails(suiteObj.test_suite, suiteObj.test_collection, testCase.title);
                  if (details) {
                      newSuiteObj.children.push(details); // Add the full details from allTestCases
                  }
              });

              newCollection.push(newSuiteObj);
          }
      });

      newArray.push(newCollection);
  });

  return newArray;
}














  // build's final data as object
  async onTestStart() {
    if (environment.isMockActive) {
      if (!this.testRunAPI.getSelectedOperator()) {
        this.sharedService.setToastAndNotification({ status: 'error', summary: 'Error!', message: 'Select a operator' });
      } else {
        this.testSandbox.setTestScreen(1);
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
        this.testSandbox.setTestScreen(1);

        /* eslint-disable @typescript-eslint/naming-convention */
        let userTestingSelectionPayload: any = {
          'name': 'test',
          'dut_name': 'test_dut',
          'selected_tests': {}
        };
        const userSelectedCollections = this.testSandbox.getSelectedData();
        let userTestingSelection: any = {};

        /* eslint-enable @typescript-eslint/naming-convention */
        for (let userSelectedTestCollectionIndex = 0; userSelectedTestCollectionIndex < userSelectedCollections.length; userSelectedTestCollectionIndex++) {
          let selectedSuites = userSelectedCollections[userSelectedTestCollectionIndex];

          if (selectedSuites.length > 0) {
            let anySelectedTestSuiteName = selectedSuites[0].public_id;
            let testCollectionName: any = this.testSandbox.getTestCollectionBySuiteName(anySelectedTestSuiteName);

            // Set test collection
            userTestingSelection[testCollectionName] = {};

            for (let selectedSuitesIndex = 0; selectedSuitesIndex < selectedSuites.length; selectedSuitesIndex++) {
              let selectedSuite = selectedSuites[selectedSuitesIndex];

              if (selectedSuite) {
                let selectedSuiteName = selectedSuite.public_id;

                // Set test suite to test collection
                userTestingSelection[testCollectionName][selectedSuiteName] = {};

                let selectedTests = selectedSuite.children;
                selectedTests.forEach((selectedTest: any) => {
                  let selectedTestName = selectedTest.public_id;
                  let runCount = selectedTest.count;

                  // Set test case and run count to test suite in test collection
                  userTestingSelection[testCollectionName][selectedSuiteName][selectedTestName] = runCount;
                });
              }
            }
          }
        }

        userTestingSelectionPayload.selected_tests = userTestingSelection

        console.log('userTestingSelection', userTestingSelection);

        this.testSandbox.createTestRunExecution(
          this.callbackForStartTestExecution.bind(this),
          userTestingSelection,
          this.testName,
          this.testRunAPI.getSelectedOperator().id,
          this.description,
          this.sharedAPI.getCertificationMode()
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
    if (!this.sharedAPI.getCertificationMode()) {
      const emptySelection: any = [];
      for (let index = 0; index < this.testSandbox.getRunTestCaseData().length; index++) {
        emptySelection[index] = [];
      }
      this.testRunStore.setSelectedTestCase(emptySelection);
      this.testSandbox.setOnClickChanges();
    }
  }
}
