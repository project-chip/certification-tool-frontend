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
import { Injectable } from '@angular/core';
import { ProjectsAPI } from 'src/app/shared/core_apis/project';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { TestRunAPI } from 'src/app/shared/core_apis/test-run';
import { WebSocketAPI } from 'src/app/shared/core_apis/websocket';
import { APP_STATE } from 'src/app/shared/utils/constants';
import { ProjectStore } from '../../store/project-store';
import { ProjectSandbox } from '../project/project.sandbox';
import { TestSandbox } from '../test/test.sandbox';
@Injectable()
export class MainAreaSandbox {
  index = -1;
  constructor(public projectStore: ProjectStore, public testRunAPI: TestRunAPI, public projectsAPI: ProjectsAPI,
    public testSandBox: TestSandbox, public sharedAPI: SharedAPI, public projectSandbox: ProjectSandbox,
    public webSocketAPI: WebSocketAPI) {
    testRunAPI.getDefaultTestCases(this.getTestData.bind(this));
  }
  public fetchCurrentIndex() {
    this.index = this.projectStore.currentPanelIndex;
    return this.index;
  }

  public get isHomePanel() {
    return this.fetchCurrentIndex() === 0;
  }

  public get isTestPanel() {
    return this.fetchCurrentIndex() === 1;
  }

  public get isSettingsPanel() {
    return this.fetchCurrentIndex() === 3;
  }

  public get isProjectTablePanel() {
    return this.fetchCurrentIndex() === 4;
  }

  public get isProjectPanel() {
    return this.fetchCurrentIndex() === 5;
  }

  public get isUtilityPanel() {
    return this.fetchCurrentIndex() === 6;
  }

  getTestData() {
    this.testSandBox.getTestData();
  }

  async syncDataToServer(dataService: any) {
    await dataService.connect();
    await this.webSocketAPI.socketSubscription();
    await this.projectsAPI.getAllProjectData(false);
    this.projectsAPI.getAllProjectData(true);
    const testExecStatusData: any = await this.testRunAPI.getExecutionStatus();

    if (testExecStatusData.state === 'running') {
      this.sharedAPI.setAppState(APP_STATE[1]);
      await this.testRunAPI.readRunningTestsRawDataAsync(testExecStatusData.test_run_execution_id,
        this.testRunAPI.updateRunningTestcase.bind(this.testRunAPI));

      this.sharedAPI.setExecutionStatus(testExecStatusData);  //  update exexutionStatus after completing above api. (used for rendering)

      const testRundata: any = this.testRunAPI.getRunningTestCasesRawData();
      const allProjects = this.projectSandbox.getAllProjectData();
      const currentProject = allProjects.filter((ele: any) => ele.id === testRundata.project_id);
      this.sharedAPI.setSelectedProjectType(currentProject[0]);
      this.projectsAPI.setCurrentPanelIndex(1);
      this.testSandBox.setTestScreen(1);

    } else {
      this.sharedAPI.setExecutionStatus(testExecStatusData);
    }
  }
}
