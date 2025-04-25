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
export const DEFAULT_POPUP_OBJECT = { 'popupId': '', 'header': '', 'subHeader': '', 'buttons': [], 'inputItems': [], 'messageId': '' , 'imgHexStr': ''};
export const EXECUTION_STATUS = ['passed', 'error', 'cancelled', 'failed', 'pending', 'executing'];
export const EXECUTION_STATUS_COMPLETED = ['passed', 'error', 'cancelled', 'failed'];
export const APP_STATE = ['READY', 'BUSY'];

export const THEMES = [
  { name: 'Default', code: 'default' },
  { name: 'Light theme', code: 'light-theme' },
  { name: 'Dark theme', code: 'dark-theme' }
];
