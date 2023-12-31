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
/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { SharedService } from 'src/app/shared/core_apis/shared-utils';
import { TestRunAPI } from 'src/app/shared/core_apis/test-run';
import { TestSandbox } from '../test.sandbox';
import { TestDetailsComponent } from './test-details.component';

class MockTestSandbox {
  getSelectedData() {
    return selected_tests;
  }
}
class MockSharedAPI { }
class MockTestRunAPI { }
class MockSharedService { }

describe('TestDetailsComponent', () => {
  let component: TestDetailsComponent, testSandbox, sharedAPI, testRunAPI, sharedService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        TestDetailsComponent,
        { provide: TestSandbox, useClass: MockTestSandbox },
        { provide: SharedAPI, useClass: MockSharedAPI },
        { provide: TestRunAPI, useClass: MockTestRunAPI },
        { provide: SharedService, useClass: MockSharedService }
      ]
    }).compileComponents();
    component = TestBed.inject(TestDetailsComponent);
    testSandbox = TestBed.inject(TestSandbox);
    sharedAPI = TestBed.inject(TestRunAPI);
    testRunAPI = TestBed.inject(TestRunAPI);
    sharedService = TestBed.inject(SharedService);
  });
  it('check isTestCaseSelected', () => {
    expect(component.isTestCaseSelected()).toBeFalse();
    selected_tests = [];
    expect(component.isTestCaseSelected()).toBeTrue();
  });
});

// selected test cases
let selected_tests = [
  [
    {
      'public_id': 'ChipToolPoCSuite',
      'version': '0.0.1',
      'title': 'This is a Proof of Concept of running chip-tool tests',
      'description': '',
      'key': 0,
      'children': [
        {
          'public_id': 'TC_BI_1_1',
          'version': '0.0.1',
          'title': '12.1.1. [TC-BI-1.1] Global attributes with server as DUT',
          'description': 'TC_BI_1_1',
          'count': 1,
          'parentKey': 0,
          'key': '0_0'
        }
      ]
    }
  ],
  []
];
