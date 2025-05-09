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
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const hostName = window.location.hostname;

export const environment = {
  production: false,
  restBaseURL: 'http://' + hostName + '/api/v1/',
  webSocketBaseURL: 'ws://' + hostName + '/api/v1/ws',
  reconnectInterval: 2000,
  mockBaseURL: 'http://' + hostName + ':3000/',
  isMockActive: false,
  streamBaseURL: 'ws://' + hostName + '/api/v1/ws/video'
};

/**
 * Adds two numbers together.
 * @return {string} The sum of the two numbers.
 */
export function getBaseUrl() {
  if (environment.isMockActive) {
    return environment.mockBaseURL;
  } else {
    return environment.restBaseURL;
  }
}

export const toastrProps = {
  preventDuplicates: true,
  destroyByClick: true,
  duration: 10000
};
