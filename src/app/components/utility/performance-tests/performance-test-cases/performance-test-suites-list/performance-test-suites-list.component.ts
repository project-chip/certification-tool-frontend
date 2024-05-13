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
import { Component, DoCheck, OnInit } from '@angular/core';
import { TestSandbox } from '../../../../test/test.sandbox';

@Component({
  selector: 'performance-test-suites-list',
  templateUrl: './performance-test-suites-list.component.html',
  styleUrls: ['./performance-test-suites-list.component.scss']
})
export class PerformanceTestSuitesListComponent implements DoCheck, OnInit {
  selectedCategories: any[] = [];
  masterCheckBox = false;
  lastChanges = true;
  categoryChanges = -1;
  constructor(public testSandbox: TestSandbox) {
    // defines number of index(test-suites)
    for (let index = 0; index < this.testSandbox.getRunTestCaseData().length; index++) {
      this.selectedCategories[index] = [];
    }
    this.testSandbox.setDefaultSelectedData(this.selectedCategories);

  }

  ngOnInit(): void {
    const categories = this.testSandbox.getTestSuiteCategory();
    const index = categories.indexOf('SDK Performance Tests');
    if (index !== -1) {
      this.testSandbox.setCurrentTestCategory(index);
    } else {
      this.testSandbox.setCurrentTestCategory(index);
      console.log('String not found in the array');
    }
  }
  // it is a hook, get triggered when value changes
  ngDoCheck() {
    if (this.lastChanges !== this.testSandbox.getOnClickChanges()) {
      this.selectedCategories[this.testSandbox.getCurrentTestCategory()] = [];
      for (let index = 0; index < this.runTestCaseData().length; index++) {
        if (this.testSandbox.getSelectedData()[this.testSandbox.getCurrentTestCategory()][index] &&
          this.testSandbox.getSelectedData()[this.testSandbox.getCurrentTestCategory()][index].children.length ===
          this.runTestCaseData()[index].children.length) {
          this.selectedCategories[this.testSandbox.getCurrentTestCategory()] =
            [...this.selectedCategories[this.testSandbox.getCurrentTestCategory()], this.runTestCaseData()[index]];
        }
      }
      this.onDataChanges();
    }
    if (this.categoryChanges !== this.testSandbox.getCurrentTestCategory()) {
      this.onDataChanges();
    }
    this.categoryChanges = this.testSandbox.getCurrentTestCategory();
    this.lastChanges = this.testSandbox.getOnClickChanges();
  }
  // checks selected test-suites length,for mastercheck box
  onDataChanges() {
    if (this.runTestCaseData().length === this.selectedCategories[this.testSandbox.getCurrentTestCategory()].length &&
      this.runTestCaseData().length !== 0) {
      this.masterCheckBox = true;
    } else {
      this.masterCheckBox = false;
    }
  }
  // check and uncheck mastercheckbox
  checkAndUncheckAll() {
    if (this.runTestCaseData().length === this.selectedCategories[this.testSandbox.getCurrentTestCategory()].length) {
      this.selectedCategories[this.testSandbox.getCurrentTestCategory()] = [];
      this.masterCheckBox = false;
      this.setSelectedItems(-2);
    } else {
      this.selectedCategories[this.testSandbox.getCurrentTestCategory()] = this.runTestCaseData();
      this.masterCheckBox = true;
      this.setSelectedItems(-1);
    }
  }
  // checks selected test-suites length,for mastercheck box
  isMasterChecked(selectedKey: any) {
    if (this.runTestCaseData().length ===
      this.selectedCategories[this.testSandbox.getCurrentTestCategory()].length) {
      this.masterCheckBox = true;
    } else {
      this.masterCheckBox = false;
    }
    this.setSelectedItems(selectedKey);
  }
  // set's current clicked test-suites
  currentElement(lastChecked: string) {
    this.testSandbox.setLastChecked(lastChecked);
    this.testSandbox.setOnClickChanges();
  }
  setSelectedItems(selectedKey: any) {
    this.testSandbox.setSelectedData(selectedKey);
  }
  // checks selected children length
  checkCurrentChildLength(parentKey: any) {
    if (this.testSandbox.getSelectedData()[this.testSandbox.getCurrentTestCategory()][parentKey] !== undefined &&
      this.testSandbox.getSelectedData()[this.testSandbox.getCurrentTestCategory()][parentKey] !== null) {
      if (this.testSandbox.getSelectedData()[this.testSandbox.getCurrentTestCategory()][parentKey].children.length > 0 &&
        this.testSandbox.getSelectedData()[this.testSandbox.getCurrentTestCategory()][parentKey].children.length <
        this.runTestCaseData()[parentKey].children.length) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  // checks all test-suites are selected
  isPartiallySelected() {
    let count = 0, childCount = 0;
    this.testSandbox.getSelectedData()[this.testSandbox.getCurrentTestCategory()].forEach((data: any) => {
      if (data) {
        if (data.children.length === this.runTestCaseData()[data.key].children.length) {
          childCount++;
          count = 1;
        } else {
          count = 1;
        }
      }
    });
    if (childCount === this.runTestCaseData().length) {
      return false;
    } else if (count === 1) {
      return true;
    } else {
      return false;
    }
  }
  runTestCaseData() {
    return this.testSandbox.getRunTestCaseData()[this.testSandbox.getCurrentTestCategory()];
  }
  //  checks is parent selected
  isParentSelected(parentKey: any) {
    let isParent = 0;
    this.selectedCategories[this.testSandbox.getCurrentTestCategory()].forEach((data: any) => {
      if (data.key === parentKey) {
        isParent = 1;
      }
    });
    if (isParent) {
      return true;
    } else {
      return false;
    }
  }
}
