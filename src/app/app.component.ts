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
import { AfterViewInit, Component } from '@angular/core';
import { MainAreaSandbox } from './components/main-area/main-area.sandbox';
import { ProjectsAPI } from './shared/core_apis/project';
import { SharedService } from './shared/core_apis/shared-utils';
import { DataService } from './shared/web_sockets/ws-config';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  constructor(public projectsAPI: ProjectsAPI, private dataService: DataService, public mainAreaSandbox: MainAreaSandbox,
    public sharedService: SharedService) {
    mainAreaSandbox.syncDataToServer(this.dataService);
  }
  ngAfterViewInit() {
    this.sharedService.checkBrowserAndVersion();
  }
}
