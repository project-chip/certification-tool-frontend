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
import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { TestRunAPI } from 'src/app/shared/core_apis/test-run';
import { APP_STATE } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-test-log-console',
  templateUrl: './test-log-console.component.html',
  styleUrls: ['./test-log-console.component.scss']
})
export class TestLogConsoleComponent implements OnInit, AfterViewChecked {
  @ViewChild('logsParentDiv') public logsScrollContainer: ElementRef<HTMLElement> | undefined;
  autoScrollToBottom: boolean;
  cols: any = [
    { field: 'message', header: 'message' }
  ];
  constructor(public testRunAPI: TestRunAPI, public sharedAPI: SharedAPI) {
    this.autoScrollToBottom = true;
  }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getFilteredLogs() {   // Dont store getTestLogs() to local variable(contains huge data)
    if (this.testRunAPI.getLogsFilterKey()) {
      return this.testRunAPI.getTestLogs().filter((ele: any) =>
        ele.message.toLowerCase().includes(this.testRunAPI.getLogsFilterKey().toLowerCase()));
    } else {
      return this.testRunAPI.getTestLogs();
    }
  }

  scrollToBottom(forceScroll = false): void {
    const scrollElement: HTMLElement | null = document.querySelector('.log-console-parent .cdk-virtual-scroll-viewport');
    if (((forceScroll) || (this.autoScrollToBottom && this.sharedAPI.getAppState() === APP_STATE[1])) && scrollElement) {
      try {
        if (!forceScroll) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        } else {
          scrollElement.scrollTo({ top: scrollElement.scrollHeight, behavior: 'smooth' });
        }
      } catch (err) { }
    }
  }

  onUserScroll() {
    this.autoScrollToBottom = false;
  }
  onAutoScrollIconClick() {
    this.autoScrollToBottom = true;
    this.scrollToBottom(true);
  }
  getLogCategory(log: any) {
    let logCategory = log.level.toLowerCase() + '-log';
    if (log.test_case_execution_index) {
      logCategory += ' testcase-log';
    } else if (log.test_suite_execution_index) {
      logCategory += ' testsuits-log';
    }
    return logCategory;
  }
  getPrefixChar(log: any) {
    let prefixChar = '';
    if (log.test_case_execution_index) {
      prefixChar = ' - ';
    } else if (log.test_suite_execution_index) {
      prefixChar = ' * ';
    }
    return prefixChar;
  }
}
