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
import { Component, DoCheck } from '@angular/core';
import * as _ from 'lodash';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { TestRunAPI } from 'src/app/shared/core_apis/test-run';
import { TestRunStore } from 'src/app/store/test-run-store';
import { TestSandbox } from '../../../test.sandbox';

@Component({
  selector: 'app-test-cases-list',
  templateUrl: './test-cases-list.component.html',
  styleUrls: ['./test-cases-list.component.scss']
})
export class TestCasesListComponent implements DoCheck {
  selectedCategories: any[] = [];
  masterCheckBox = false;
  lastChanges = true;
  certificationMode = false;
  constructor(public testSandbox: TestSandbox, public testRunStore: TestRunStore,
    public testRunAPI: TestRunAPI, public sharedAPI: SharedAPI) {
    // defines number of index(test-cases)
    this.testSandbox.getRunTestCaseData().forEach((category: any, categoryIndex: any) => {
      this.selectedCategories[categoryIndex] = [];
      this.testSandbox.getRunTestCaseData()[categoryIndex].forEach((testSuit: any, testSuitIndex: any) => {
        this.selectedCategories[categoryIndex][testSuitIndex] = [];
      });
    });
    this.certificationMode = this.sharedAPI.getCertificationMode();
  }
  // it is a hook, get triggered when value changes
  ngDoCheck() {
    if (this.lastChanges !== this.testSandbox.getOnClickChanges()) {
      for (let index = 0; index < this.runTestCaseData().length; index++) {
        if (this.testSandbox.getSelectedData()[this.testSandbox.getCurrentTestCategory()][index]) {
          if (this.testSandbox.getSelectedData()[this.testSandbox.getCurrentTestCategory()][index].children.length ===
            this.runTestCaseData()[index].children.length) {
            this.selectedCategories[this.testSandbox.getCurrentTestCategory()][index] =
              this.runTestCaseData()[index].children;
          }
        } else {
          this.selectedCategories[this.testSandbox.getCurrentTestCategory()][index] = [];
        }
      }
      this.lastChanges = this.testSandbox.getOnClickChanges();
    }
    if (this.runTestCaseData().length !== 0 && this.runTestCaseData()[this.testSandbox.getLastChecked()].children.length ===
      this.selectedCategories[this.testSandbox.getCurrentTestCategory()][this.testSandbox.getLastChecked()].length) {
      this.masterCheckBox = true;
    } else {
      this.masterCheckBox = false;
    }
    if (this.testSandbox.getDetectPicsChanges()[this.testSandbox.getCurrentTestCategory()] === true) {
      setTimeout(() => this.checkPicsData(), 200);
    }
  }
  // check and uncheck mastercheckbox
  checkAndUncheckAll() {
    if (this.runTestCaseData()[this.testSandbox.getLastChecked()].children.length ===
      this.selectedCategories[this.testSandbox.getCurrentTestCategory()][this.testSandbox.getLastChecked()].length) {
      this.selectedCategories[this.testSandbox.getCurrentTestCategory()][this.testSandbox.getLastChecked()] = [];
      this.masterCheckBox = false;
    } else {
      this.selectedCategories[this.testSandbox.getCurrentTestCategory()][this.testSandbox.getLastChecked()] =
        this.runTestCaseData()[this.testSandbox.getLastChecked()].children;
      this.masterCheckBox = true;
    }
    this.onSelectedChildren();
  }
  // checks selected test-cases length,for mastercheck box
  isMasterChecked() {
    if (this.runTestCaseData()[this.testSandbox.getLastChecked()].children.length ===
      this.selectedCategories[this.testSandbox.getCurrentTestCategory()][this.testSandbox.getLastChecked()].length) {
      this.masterCheckBox = true;
    } else {
      this.masterCheckBox = false;
    }
    this.onSelectedChildren();
  }
  // set's selectedChildren to mobx
  onSelectedChildren() {
    this.testSandbox.setSelectedChild(
      this.selectedCategories[this.testSandbox.getCurrentTestCategory()][this.testSandbox.getLastChecked()]);
  }
  // checks selected children
  childrenSelected(parent: any, child: any) {
    let checkKey = -1;
    if (this.selectedCategories[this.testSandbox.getCurrentTestCategory()][parent]) {
      this.selectedCategories[this.testSandbox.getCurrentTestCategory()][parent].forEach((data: any) => {
        if (data.key === child) {
          checkKey = 1;
        }
      });
    }
    if (checkKey === 1) {
      return true;
    } else {
      return false;
    }
  }
  // set's current clicked test-cases
  onClickChanges() {
    this.onSelectedChildren();
    this.testSandbox.setOnClickChanges();
  }
  // checks all test-cases are selected
  isPartiallySelected(currentIndex: any) {
    if (this.runTestCaseData().length !== 0 &&
      this.selectedCategories[this.testSandbox.getCurrentTestCategory()][currentIndex].length > 0 &&
      this.selectedCategories[this.testSandbox.getCurrentTestCategory()][currentIndex].length <
      this.runTestCaseData()[currentIndex].children.length) {
      return true;
    } else {
      return false;
    }
  }
  // get current test case data
  runTestCaseData() {
    return this.testSandbox.getRunTestCaseData()[this.testSandbox.getCurrentTestCategory()];
  }
  checkPicsData() {
    const detectPicsData = _.cloneDeep(this.testSandbox.getDetectPicsChanges());
    for (let index = 0; index < this.runTestCaseData().length; index++) {
      if (this.getSelectedTestCases()[index]) {
        const selectedPics = this.getSelectedTestCases()[index].children.map((data: any) =>
          this.runTestCaseData()[index].children[data.picsKey]
        );
        this.selectedCategories[this.testSandbox.getCurrentTestCategory()][index] = selectedPics;
      }
    }
    detectPicsData[this.testSandbox.getCurrentTestCategory()] = false;
    this.testSandbox.setDetectPicsChanges(detectPicsData);
  }
  getSelectedTestCases() {
    return this.testSandbox.getSelectedData()[this.testSandbox.getCurrentTestCategory()];
  }
}

