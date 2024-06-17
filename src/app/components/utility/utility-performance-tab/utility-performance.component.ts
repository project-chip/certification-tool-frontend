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
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { TestSandbox } from '../../test/test.sandbox';

@Component({
  selector: 'app-utility-performance',
  templateUrl: './utility-performance.component.html',
  styleUrls: ['./utility-performance.component.scss']
})

export class UtilityPerformanceComponent {
  constructor(public sharedAPI: SharedAPI, public testSandBox: TestSandbox) {}
}
