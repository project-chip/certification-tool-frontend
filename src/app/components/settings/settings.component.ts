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
import { ProjectsAPI } from 'src/app/shared/core_apis/project';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { THEMES } from 'src/app/shared/utils/constants';
import { addThemeSwitchClass } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  themesOption: any;
  onEnvironmentEdit = false;
  environmentData: any = [];
  constructor(public sharedAPI: SharedAPI, public projectAPI: ProjectsAPI) {
    this.themesOption = THEMES;
    this.environmentData = JSON.stringify(sharedAPI.getEnvironmentConfig(), null, '   ');
  }

  onThemeChange(value: any) {
    localStorage.setItem('selectedTheme', value.code);
    this.sharedAPI.setSelectedTheme(value);
    addThemeSwitchClass(value);
    if (value === THEMES[0] || value === THEMES[1]) {
      this.sharedAPI.setSelectedLightTheme(value);
    }
  }
}
