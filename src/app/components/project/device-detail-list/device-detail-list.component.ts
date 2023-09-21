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
import { Component, Injectable, OnInit } from '@angular/core';
import { getDefaultSettings, ProjectsAPI } from 'src/app/shared/core_apis/project';
import { ProjectService } from 'src/app/shared/project-utils';
import { ProjectSandbox } from '../project.sandbox';

@Component({
  selector: 'app-device-detail-list',
  templateUrl: './device-detail-list.component.html',
  styleUrls: ['./device-detail-list.component.scss']
})

@Injectable()
// This component is wrapping the device-details and show additional config
export class DeviceDetailListComponent implements OnInit {
  addedSettings: any[];
  settingsType: any[];

  constructor(public projectsAPI: ProjectsAPI, public projectSandbox: ProjectSandbox, public projectService: ProjectService) {
    this.addedSettings = getDefaultSettings();
    this.settingsType = getDefaultSettings();
  }

  ngOnInit() {
    this.projectsAPI.getSettingsJsonData();
  }
  onCreate() {
    if (!this.projectsAPI.getIsCreateProjectContainsWarning()) {
      this.projectService.cursorBusy(true);
      this.projectSandbox.createNewProject();
    }
  }
}
