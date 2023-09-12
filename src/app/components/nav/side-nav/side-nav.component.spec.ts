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
import { ConfirmationService } from 'primeng/api';
import { ProjectsAPI } from 'src/app/shared/core_apis/project';
import { TestSandbox } from '../../test/test.sandbox';
import { NavSandbox } from '../nav.sandbox';
import { SideNavComponent } from './side-nav.component';

class MockSideNav {
  // get current component index
  getCurrentIndex() {
    return 1;
  }
}
describe('SideNavComponent', () => {
  let component: SideNavComponent, navSandbox, projectApi, confirmationService, testSandbox;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        SideNavComponent,
        { provide: NavSandbox, useClass: MockSideNav },
        { provide: ProjectsAPI, useClass: MockSideNav },
        { provide: ConfirmationService, useClass: MockSideNav },
        { provide: TestSandbox, useClass: MockSideNav }
      ]
    }).compileComponents();
    component = TestBed.inject(SideNavComponent);
    navSandbox = TestBed.inject(NavSandbox);
    projectApi = TestBed.inject(ProjectsAPI);
    confirmationService = TestBed.inject(ConfirmationService);
    testSandbox = TestBed.inject(TestSandbox);

  });

  it('should contain SideNavComponent', () => {
    expect(component).toBeTruthy();
    expect(component.sideBarClicked).toBeTruthy();
  });
});
