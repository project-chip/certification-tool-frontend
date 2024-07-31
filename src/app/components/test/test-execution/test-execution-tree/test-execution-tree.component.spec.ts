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
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { TestRunAPI } from 'src/app/shared/core_apis/test-run';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { TestExecutionTreeComponent } from './test-execution-tree.component';


class MockTestRunAPI {
  getRunningTestCasesRawData() {
    return [];
  }
  getTestCollectionData() {
    return [];
  }
  getRunningTestCases() {
    return getRunningTestDummyJson();
  }
}

describe('TestExecutionTreeComponent', () => {
  let component: TestExecutionTreeComponent;
  let fixture: ComponentFixture<TestExecutionTreeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestExecutionTreeComponent],
      providers: [
        { provide: TestRunAPI, useClass: MockTestRunAPI },
        { provide: SharedAPI, useClass: MockTestRunAPI }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(TestExecutionTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const data = 'Default';
  it('check switchActiveBlock', () => {
    component.switchActiveBlock(data);
    expect(component.activeBlock).toEqual(data);
    component.switchActiveBlock(data);
    expect(component.activeBlock).toEqual('');
  });

  // Configuration: passed, error and warning are the sample JSON used for validation.
  const passed = [
    {
      'key': 'test_suite_execution_219',
      'name': 'CommissioningSampleTestSuite',
      'expanded': true,
      'count': '1',
      'status': 'passed',
      'progress': 100,
      'children': []
    },
    {
      'key': 'test_suite_execution_220',
      'name': 'SampleTestSuite1',
      'expanded': true,
      'count': '1',
      'status': 'passed',
      'progress': 100,
      'children': []
    }
  ];
  const error = [
    {
      'key': 'test_suite_execution_219',
      'name': 'CommissioningSampleTestSuite',
      'expanded': true,
      'count': '1',
      'status': 'error',
      'progress': 100,
      'children': []
    },
    {
      'key': 'test_suite_execution_220',
      'name': 'SampleTestSuite1',
      'expanded': true,
      'count': '1',
      'status': 'passed',
      'progress': 100,
      'children': []
    }
  ];
  const executing = [
    {
      'key': 'test_suite_execution_219',
      'name': 'CommissioningSampleTestSuite',
      'expanded': true,
      'count': '1',
      'status': 'executing',
      'progress': 100,
      'children': []
    },
    {
      'key': 'test_suite_execution_220',
      'name': 'SampleTestSuite1',
      'expanded': true,
      'count': '1',
      'status': 'executing',
      'progress': 100,
      'children': []
    }
  ];

  // Configuration: these are the expected return values.
  const passedReturn = { className: 'pi pi-check success', iconTitle: 'Passed' };
  const errorReturn = { className: 'pi pi-times error', iconTitle: 'Error' };
  const executingReturn = { className: 'pi pi-spin pi-spinner', iconTitle: 'Executing' };
  const isNotApplicableReturn = { className: 'pi pi-angle-double-right not-applicable', iconTitle: 'Not Applicable' };

  it('check getCategoryClassName className', () => {
    const passedReturnValue = component.getCategoryClassName(passed).className;
    const errorReturnValue = component.getCategoryClassName(error).className;
    const executingReturnValue = component.getCategoryClassName(executing).className;
    const isNotApplicableReturnValue = component.getCategoryClassName(isNotApplicableReturn).className;
    expect(passedReturn.className).toEqual(passedReturnValue);
    expect(errorReturn.className).toEqual(errorReturnValue);
    expect(executingReturn.className).toEqual(executingReturnValue);
    expect(isNotApplicableReturn.className).toEqual(isNotApplicableReturnValue);
  });

  it('check getCategoryClassName iconTitle', () => {
    const passedReturnValue = component.getCategoryClassName(passed).iconTitle;
    const errorReturnValue = component.getCategoryClassName(error).iconTitle;
    const executingReturnValue = component.getCategoryClassName(executing).iconTitle;
    const isNotApplicableReturnValue = component.getCategoryClassName(isNotApplicableReturn).iconTitle;
    expect(passedReturn.iconTitle).toEqual(passedReturnValue);
    expect(errorReturn.iconTitle).toEqual(errorReturnValue);
    expect(executingReturn.iconTitle).toEqual(executingReturnValue);
    expect(isNotApplicableReturn.iconTitle).toEqual(isNotApplicableReturnValue);
  });

  it('check getFilteredRunningTestCases', () => {
    const testCollection = getTestCollection();
    const testCollection2 = getTestCollection2();
    const filteredJson = component.getFilteredRunningTestCases(testCollection);
    expect(filteredJson.length).toEqual(1);
    expect(filteredJson).toEqual(getRunningTestDummyJson());

    const filteredJson2 = component.getFilteredRunningTestCases(testCollection2);
    expect(filteredJson2.length).toEqual(0);
    expect(filteredJson2).toEqual([]);
  });
});


/* eslint-disable @typescript-eslint/naming-convention */
// Configuration: this returns testCollection sample JSON.
function getTestCollection() {
  return {
    'key': 'sample_tests',
    'value': {
      'name': 'sample_tests',
      'path': '/app/backend/app/test_engine/../../test_collections/sample_tests',
      'test_suites': {
        'SampleTestSuite1': {
          'metadata': {
            'public_id': 'SampleTestSuite1',
            'version': '1.2.3',
            'title': 'This is Test Suite 1',
            'description': 'This is Test Suite 1, it will not get a very long description',
            'key': 1,
            'children': [
              {
                'public_id': 'TCSS1001',
                'version': '1.2.3',
                'title': 'This is Test Case tcss1001',
                'description': 'This is Test Case tcss1001,        it will not get a very long description',
                'count': 1,
                'parentKey': 1,
                'key': '1_0'
              },
              {
                'public_id': 'TCSS1002',
                'version': '3.2.1',
                'title': 'This is Test Case tcss1002',
                'description': 'This is Test Case tcss1002, it will not get a very long         description',
                'count': 1,
                'parentKey': 1,
                'key': '1_1'
              }
            ]
          },
          'test_cases': {
            'TCSS1001': {
              'metadata': {
                'public_id': 'TCSS1001',
                'version': '1.2.3',
                'title': 'This is Test Case tcss1001',
                'description': 'This is Test Case tcss1001,        it will not get a very long description',
                'count': 1,
                'parentKey': 1,
                'key': '1_0'
              }
            },
            'TCSS1002': {
              'metadata': {
                'public_id': 'TCSS1002',
                'version': '3.2.1',
                'title': 'This is Test Case tcss1002',
                'description': 'This is Test Case tcss1002, it will not get a very long         description',
                'count': 1,
                'parentKey': 1,
                'key': '1_1'
              }
            }
          }
        }
      }
    }
  };
}

// Configuration: this returns testCollection sample JSON without suits data.
function getTestCollection2() {
  return {
    'key': 'official_tests',
    'value': {
      'name': 'official_tests',
      'path': '/app/backend/app/test_engine/../../test_collections/official_tests',
      'test_suites': {}
    }
  };
}
/* eslint-enable @typescript-eslint/naming-convention */

// Configuration: this returns running test sample JSON.
function getRunningTestDummyJson() {
  return [
    {
      'key': 'test_suite_execution_239',
      'name': 'SampleTestSuite1',
      'expanded': true,
      'count': '1',
      'status': 'passed',
      'progress': 100,
      'children': [
        {
          'key': 'test_case_execution_949',
          'name': 'TCSS1001',
          'expanded': true,
          'count': '1',
          'status': 'passed',
          'children': [
            {
              'key': 'test_step_execution_5533',
              'name': 'Test Step 1',
              'status': 'passed',
              'children': []
            },
            {
              'key': 'test_step_execution_5534',
              'name': 'Test Step 2',
              'status': 'passed',
              'children': []
            }
          ]
        },
        {
          'key': 'test_case_execution_950',
          'name': 'TCSS1002',
          'expanded': true,
          'count': '1',
          'status': 'passed',
          'children': [
            {
              'key': 'test_step_execution_5538',
              'name': 'Test Step 1',
              'status': 'passed',
              'children': []
            },
            {
              'key': 'test_step_execution_5539',
              'name': 'Test Step 2',
              'status': 'passed',
              'children': []
            }
          ]
        }
      ]
    }
  ];
}
