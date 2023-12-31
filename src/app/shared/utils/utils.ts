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
export function getTimeStamp() {
  const dateTime = new Date();
  const title = dateTime.getFullYear() + '_' + (dateTime.getMonth() + 1).toString().padStart(2, '0') + '_' +
    dateTime.getDate().toString().padStart(2, '0') + '_' + dateTime.getHours().toString().padStart(2, '0') + '_'
    + dateTime.getMinutes().toString().padStart(2, '0') + '_' + dateTime.getSeconds().toString().padStart(2, '0');
  return title;
}

export function addThemeSwitchClass(value: any) {
  document.getElementsByTagName('body')[0].className = '';
  document.getElementsByTagName('body')[0].classList.add(value.code);
}
