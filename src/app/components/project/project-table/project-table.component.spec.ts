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
import { TestBed } from '@angular/core/testing';
import { ProjectsAPI } from 'src/app/shared/core_apis/project';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { SharedService } from 'src/app/shared/core_apis/shared-utils';
import { TestSandbox } from '../../test/test.sandbox';
import { ProjectSandbox } from '../project.sandbox';
import { ProjectTableComponent } from './project-table.component';

class MockProjectSandbox {
  getProjectType() {
    return 0;
  }
}
class MockProjectAPI {
  updateProject(data: any) { }
}
class MockSharedAPI { }
class MockTestSandbox { }
class MockSharedService { }
describe('ProjectTableComponent', () => {
  let component: ProjectTableComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProjectTableComponent,
        { provide: ProjectSandbox, useClass: MockProjectSandbox },
        { provide: ProjectsAPI, useClass: MockProjectAPI },
        { provide: SharedAPI, useClass: MockSharedAPI },
        { provide: TestSandbox, useClass: MockTestSandbox },
        { provide: SharedService, useClass: MockSharedService }
      ]
    }).compileComponents();
    component = TestBed.inject(ProjectTableComponent);
    const projectSandbox = TestBed.inject(ProjectSandbox);
    const projectAPI = TestBed.inject(ProjectsAPI);
    const sharedAPI = TestBed.inject(SharedAPI);
    const testSandbox = TestBed.inject(TestSandbox);
  });
  it('updateProjectClicked', () => {
    component.updateProjectClicked('update');
    expect(component.isUpdateClicked).toBe(true);
  });

  it('updateProject', () => {
    component.updateProject();
    expect(component.isUpdateClicked).toBe(false);
  });

});
