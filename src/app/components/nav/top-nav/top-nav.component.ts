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
import { ProjectsAPI } from 'src/app/shared/core_apis/project';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { THEMES } from 'src/app/shared/utils/constants';
import { addThemeSwitchClass } from 'src/app/shared/utils/utils';
import { ProjectSandbox } from '../../project/project.sandbox';
import { TestSandbox } from '../../test/test.sandbox';
import { NavSandbox } from '../nav.sandbox';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})

// This is a component used to display Top navigation bar.
export class TopNavComponent implements DoCheck {
  headerName?: any;
  dropdownData: any = '';
  selectedProject?: any;
  display = false;
  notification = false;
  themesOption = THEMES;
  constructor(public navSandbox: NavSandbox, public projectsAPI: ProjectsAPI,
    public projectSandbox: ProjectSandbox, public sharedAPI: SharedAPI, public testSandbox: TestSandbox) {
    this.getProjectDataLen();

    window.onclick = (event: any) => {
      /* eslint-disable prefer-const */
      let notificationElement = document.getElementById('notification');
      let notificationClick = document.getElementById('notification-click');
      /* eslint-enable prefer-const */
      if (!notificationElement?.contains(event.target) && !notificationClick?.contains(event.target)) {
        this.notification = false;
      }
    };
    if (localStorage.getItem('selectedTheme')) {
      const storedTheme = THEMES.find(data => data.code === localStorage.getItem('selectedTheme'));
      this.sharedAPI.setSelectedTheme(storedTheme);
      addThemeSwitchClass(storedTheme);
    }
  }

  ngDoCheck() {
    if (this.headerName !== this.sharedAPI.getSelectedProjectType()) {
      this.headerName = this.sharedAPI.getSelectedProjectType();
    }

    if (!this.sharedAPI.getSelectedProjectType() && (
      this.navSandbox.getCurrentIndex() === 1 || (this.navSandbox.getCurrentIndex() === 6 && this.sharedAPI.getUtilityIndex() === 1) )) {
      this.display = true;
    }
  }

  shouldShowProjectDropDown() {
    const isProjectSelected = this.sharedAPI.getSelectedProjectType();
    const isTestScreen = this.navSandbox.getCurrentIndex() === 1;
    const isStressStabilityTestScreen = this.navSandbox.getCurrentIndex() === 6 && this.sharedAPI.getUtilityIndex() === 1;
    const isProjectTable = this.projectSandbox.getProjectType().tableName ==='Projects';
    return isProjectSelected && (isTestScreen || isStressStabilityTestScreen) && isProjectTable;
  }

  shouldShowProjectSelectPopup() {
    const isProjectSelected = this.sharedAPI.getSelectedProjectType();
    const isTestScreen = this.navSandbox.getCurrentIndex() === 1;
    const isStressStabilityTestScreen = this.navSandbox.getCurrentIndex() === 6 && this.sharedAPI.getUtilityIndex() === 1;
    return !isProjectSelected && (isTestScreen || isStressStabilityTestScreen);
  }

  getProjectDataLen() {
    this.dropdownData = this.projectSandbox.getAllProjectData();
    if (this.dropdownData.length === 0) {
      if (this.projectSandbox.getArchivedProjects().length === 0) {
        this.projectsAPI.setCurrentPanelIndex(5);
      }
      this.dropdownData = this.projectSandbox.getArchivedProjects();
    }
    return this.dropdownData.length;
  }

  closePopUp() {
    this.display = false;
    this.headerName = this.selectedProject || this.dropdownData[0];
    this.sharedAPI.setSelectedProjectType(this.headerName);
    this.testSandbox.getTestExecutionResults(this.headerName?.id);
  }
  projectChanged() {
    this.sharedAPI.setSelectedProjectType(this.headerName);
    this.testSandbox.getTestExecutionResults(this.headerName?.id);
    this.testSandbox.setTestScreen(2);
    this.testSandbox.setPerformanceTestScreen(2);
  }
  onThemeSwitch() {
    let newTheme;
    if (this.sharedAPI.getSelectedTheme() === this.themesOption[2]) {
      newTheme = this.sharedAPI.getSelectedLightTheme();
    } else {
      newTheme = THEMES[2];
    }
    localStorage.setItem('selectedTheme', newTheme.code);
    this.sharedAPI.setSelectedTheme(newTheme);
    addThemeSwitchClass(newTheme);
  }
  onClickNotification() {
    this.sharedAPI.setIsNotificationRead(false);
    this.notification = !this.notification;
  }
  findTime(date: any) {
    const differenceInMinutes = Math.floor(((new Date().getTime() - new Date(date).getTime()) / (1000 * 60)));
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);
    const differenceInMonths = Math.floor(differenceInDays / 30);
    if (differenceInMinutes < 1) {
      return 'Just Now';
    } else if (differenceInMinutes > 0 && differenceInMinutes < 61) {
      return differenceInMinutes + 'mins ago';
    } else if (differenceInHours > 0 && differenceInHours < 25) {
      return differenceInHours + ' hours ago';
    } else if (differenceInMonths > 0 && differenceInMonths < 13) {
      return differenceInMonths + ' months ago';
    } else {
      return 'a while ago';
    }
  }

}
