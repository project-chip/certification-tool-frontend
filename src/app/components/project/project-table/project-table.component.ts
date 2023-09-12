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
import { Component } from '@angular/core';
import { projectDropdown, ProjectsAPI } from 'src/app/shared/core_apis/project';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { TestSandbox } from '../../test/test.sandbox';
import { ProjectSandbox } from '../project.sandbox';
import * as  _ from 'lodash';
import { SharedService } from 'src/app/shared/core_apis/shared-utils';
@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.scss']
})

// This is a component used to display all the Projects in table
export class ProjectTableComponent {
  projectDropdownData: any = projectDropdown();
  selectedDropdownData = this.projectSandbox.getProjectType();
  updateProjectData: any = [];
  projectConfig: any = [];
  isUpdateClicked = false;
  multiplePics = 0;
  allowedCharacter = /[^A-Za-z0-9 _-]/;
  constructor(public projectSandbox: ProjectSandbox, public projectsAPI: ProjectsAPI,
    public sharedAPI: SharedAPI, public testSandbox: TestSandbox, public sharedService: SharedService) { }
  addNewProject() {
    this.projectsAPI.setIsNewProjectClicked(true);
    this.projectsAPI.setCurrentPanelIndex(5);
  }
  deleteProject(projectId: number) {
    this.projectSandbox.deleteProject(projectId);
  }
  toTestSelection(projectData: any) {
    this.sharedAPI.setSelectedProjectType(projectData);
    this.testSandbox.getTestExecutionResults(projectData.id);
    this.testSandbox.setTestScreen(2);
    this.projectsAPI.setCurrentPanelIndex(1);
  }
  updateProjectClicked(data: any) {
    this.updateProjectData = _.cloneDeep(data);
    const editData = {
      'config': this.updateProjectData.config,
      'pics': this.updateProjectData.pics
    };
    this.projectConfig = JSON.stringify(editData, null, '  ');
    this.isUpdateClicked = true;
  }
  updateProject() {
    if (this.updateProjectData.name && !this.allowedCharacter.test(this.updateProjectData.name)) {
      const parsedData = JSON.parse(this.projectConfig);
      this.updateProjectData.config = parsedData.config;
      this.updateProjectData.pics = parsedData.pics;
      this.projectsAPI.updateProject(this.updateProjectData);
      this.isUpdateClicked = false;
    }
  }
  archiveProject(id: any) {
    if (this.selectedDropdownData.tableName === 'Archive Project') {
      this.projectsAPI.unarchiveProject(id);
    } else {
      this.projectsAPI.archiveProject(id);
    }
  }
  onProjectTypeChange() {
    this.projectSandbox.setProjectType(this.selectedDropdownData);
  }
  onUpload(data: any, id: any) {
    if (data.target.files.item(this.multiplePics)) {
      const file: File = data.target.files.item(this.multiplePics++);
      this.projectsAPI.uploadPics(file, id, this.onUpload.bind(this, data, id), this.updatedPICS.bind(this));
    } else {
      this.multiplePics = 0;
    }
  }
  deletePICS(data: any, id: any) {
    this.projectsAPI.deletePics(data, id, this.updatedPICS.bind(this));
  }
  updatedPICS(data: any) {
    this.updateProjectData = data;
    this.updateProjectClicked(data);
  }
  chagePicsType(data: any) {
    return Object.keys(data);
  }
}
