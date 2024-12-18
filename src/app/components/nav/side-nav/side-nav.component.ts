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
import { ConfirmationService } from 'primeng/api';
import { ProjectsAPI } from 'src/app/shared/core_apis/project';
import { TestSandbox } from '../../test/test.sandbox';
import { NavSandbox } from '../nav.sandbox';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})

// This is a component for Sidebar navigation controls
export class SideNavComponent {
  sideBarIndex = this.navSandbox.getCurrentIndex();

  constructor(public navSandbox: NavSandbox, public projectsAPI: ProjectsAPI,
    public confirmationService: ConfirmationService, public testSandBox: TestSandbox) { }
  sideBarClicked(index: number) {
    if (this.navSandbox.getCurrentIndex() === 6 && index !== 6 && this.testSandBox.getPerformanceTestScreen() === 1) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        header: 'You Are in Test Execution Screen',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.projectsAPI.setCurrentPanelIndex(index);
          this.sideBarIndex = index;
        },
        reject: () => {
        }
      });
    } else if (this.navSandbox.getCurrentIndex() === 6 && index === 6 && this.testSandBox.getPerformanceTestScreen() === 0) {
      this.testSandBox.setPerformanceTestScreen(2);
      this.projectsAPI.setCurrentPanelIndex(index);
      this.sideBarIndex = index;

    } else if (this.navSandbox.getCurrentIndex() === 1 && index !== 1 && this.testSandBox.getTestScreen() !== 2) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        header: 'You Are in Test Execution Screen',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.projectsAPI.setCurrentPanelIndex(index);
          this.sideBarIndex = index;
        },
        reject: () => {
        }
      });
    } else {
      if (index === 1 && this.testSandBox.getTestScreen() === 0) {
        // If user is in Test-selection screen and click on "Test" on left-nav show test-history screen.
        this.testSandBox.setTestScreen(2);
      }
      this.projectsAPI.setCurrentPanelIndex(index);
      this.sideBarIndex = index;
    }
  }
}
