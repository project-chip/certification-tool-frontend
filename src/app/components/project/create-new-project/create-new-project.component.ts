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
import { Component, Injectable } from '@angular/core';
import { ProjectsAPI } from 'src/app/shared/core_apis/project';
import { NavSandbox } from '../../nav/nav.sandbox';
import { ProjectSandbox } from '../project.sandbox';
@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.component.html',
  styleUrls: ['./create-new-project.component.scss']
})

@Injectable({
  providedIn: 'root'
})
// This is a component used to display create button to redirect to create new project
export class CreateNewProjectComponent {
  constructor(public projectSandbox: ProjectSandbox, public projectsAPI: ProjectsAPI, public navSandbox: NavSandbox) { }

  createNewProject() {
    this.projectsAPI.setIsNewProjectClicked(true);
  }
}
