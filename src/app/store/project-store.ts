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

@Injectable({ providedIn: 'root' })
export class ProjectStore {
  @observable newProjectDetails = [];
  @action setNewProjectDetails(newProjectDetails: any) {
    this.newProjectDetails = newProjectDetails;
  }
  @observable runningTestCases = [];
  @action setRunningTestCases(runningTestCases: any) {
    this.runningTestCases = runningTestCases;
  }
  @observable allProjectData: any = [];
  @action setAllProjectData(allProjectData: any) {
    this.allProjectData = allProjectData;
  }
  @observable currentPanelIndex = 1;
  @action setCurrentPanelIndex(currentPanelIndex: number) {
    this.currentPanelIndex = currentPanelIndex;
  }
  @observable isNewProjectClicked: any = null;
  @action setIsNewProjectClicked(newProjectIndex: boolean) {
    this.isNewProjectClicked = newProjectIndex;
  }
  @observable userIndex = 0;
  @action setUserIndex(userIndex: number) {
    this.userIndex = userIndex;
  }
  @observable projectDetails = {
    'name': 'New Project',
    'config': {}
  };
  @action setProjectDetails(projectDetails: any) {
    this.projectDetails = projectDetails;
  }
  @observable isCreateProjectContainsWarning = false;
  @action setIsCreateProjectContainsWarning(value: boolean) {
    this.isCreateProjectContainsWarning = value;
  }
  @observable archivedProjects: any = '';
  @action setArchivedProjects(data: any) {
    this.archivedProjects = data;
  }

  @observable projectType: any = {
    'tableName': 'Projects',
    'toolTip': 'Archive'
  };
  @action setProjectType(data: any) {
    this.projectType = data;
  }
}
