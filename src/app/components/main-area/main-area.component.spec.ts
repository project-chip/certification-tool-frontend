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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectSandbox } from '../project/project.sandbox';
import { MainAreaComponent } from './main-area.component';
import { MainAreaSandbox } from './main-area.sandbox';
class MockProjectSandbox {
  // This function is returning projectData
  getAllProjectData() {
    const data = [
      { name: 'harish' },
      { name: 'san' }, { name: 'ock' }];
    return data;
  }
  getArchivedProjects() {
    const data = [
      { name: 'harish' },
      { name: 'san' }, { name: 'ock' }];
    return data;
  }
};

describe('MainAreaComponent', () => {
  let component: MainAreaComponent;
  let fixture: ComponentFixture<MainAreaComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainAreaComponent],
      providers: [
        { provide: ProjectSandbox, useClass: MockProjectSandbox },
        { provide: MainAreaSandbox, useClass: MockProjectSandbox }
      ]
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(MainAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return a valid length', () => {
    expect(component.getIsNavBarVisible()).toBe(1);
  });
});
