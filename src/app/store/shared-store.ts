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
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Injectable } from '@angular/core';
import { observable, action } from 'mobx';
import { APP_STATE, DEFAULT_POPUP_OBJECT, THEMES } from '../shared/utils/constants';

@Injectable({ providedIn: 'root' })
export class SharedStore {

  @observable showCustomPopup = '';
  @action setShowCustomPopup(showCustomPopup: string) {
    this.showCustomPopup = showCustomPopup;
  }
  @observable customPopupData = DEFAULT_POPUP_OBJECT;
  @action setCustomPopupData(customPopupData: any) {
    this.customPopupData = customPopupData;
  }
  @observable appState = APP_STATE[0];
  @action setAppState(appState: string) {
    this.appState = appState;
  }
  @observable isProjecTypeSelected = 0;
  @action setIsProjectTypeSelected(isProjecTypeSelected: number) {
    this.isProjecTypeSelected = isProjecTypeSelected;
  }
  @observable selectedProjectType: any = null;
  @action setSelectedProjectType(selectedProjectType: any) {
    this.selectedProjectType = selectedProjectType;
  }
  @observable isPerformanceTypeSelected = 0;
  @action setIsPerformanceTypeSelected(isPerformanceTypeSelected: number) {
    this.isPerformanceTypeSelected = isPerformanceTypeSelected;
  }
  @observable testReportData: any = '';
  @action setTestReportData(report: any) {
    this.testReportData = report;
  }
  @observable selectedTheme = THEMES[1];
  @action setSelectedTheme(theme: any) {
    this.selectedTheme = theme;
  }
  @observable selectedLightTheme = THEMES[1];
  @action setSelectedLightTheme(theme: any) {
    this.selectedLightTheme = theme;
  }
  @observable notificationMessage: any = [];
  @action setNotificationMessage(message: any) {
    this.notificationMessage.push(message);
    this.isNotificationRead = true;
  }
  @observable isNotificationRead = false;
  @action setIsNotificationRead(data: any) {
    this.isNotificationRead = data;
  }
  @observable webSocketLoader = false;
  @action setWebSocketLoader(data: any) {
    this.webSocketLoader = data;
  }
  @observable executionStatus = { 'state': '' };
  @action setExecutionStatus(data: any) {
    this.executionStatus = data;
  }
  @observable bufferWSData: any = [];
  @action setbufferWSData(message: any) {
    this.bufferWSData = message;
  }
  @observable testExecutionLoader = true;
  @action setTestExecutionLoader(data: any) {
    this.testExecutionLoader = data;
  }
  @observable testCaseLoader = false;
  @action setTestCaseLoader(data: any) {
    this.testCaseLoader = data;
  }
  @observable environmentConfig = [];
  @action setEnvironmentConfig(data: any) {
    this.environmentConfig = data;
  }
  @observable shaVersion: any = '';
  @action setShaVersion(data: any) {
    this.shaVersion = data;
  }
}
