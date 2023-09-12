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
import { ProjectSandbox } from '../project/project.sandbox';
import { MainAreaSandbox } from './main-area.sandbox';

@Component({
  selector: 'app-main-area',
  templateUrl: './main-area.component.html',
  styleUrls: ['./main-area.component.scss']
})

// This component will show the UI based on left-nav-bar tab selection.
export class MainAreaComponent {
  constructor(public mainAreaSandbox: MainAreaSandbox, public projectSandbox: ProjectSandbox) {
  }

  getIsNavBarVisible() {
    if (this.projectSandbox.getAllProjectData().length || this.projectSandbox.getArchivedProjects().length) {
      return 1;
    } else {
      return 0;
    }
  }
}
