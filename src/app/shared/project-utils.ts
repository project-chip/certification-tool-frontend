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
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getBaseUrl } from 'src/environments/environment';

@Injectable()
export class ProjectService {
  constructor(private http: HttpClient) {
  }

  getSettingsJson(): Observable<any> {
    return this.http.get(getBaseUrl() + 'settings-json');
  }

  getProjectData(isArchived: any, limit: any): Observable<any> {
    return this.http.get(getBaseUrl() + 'projects/?archived=' + isArchived + '&skip=' + limit + '&limit=250');
  }

  setProjectData(value: any): Observable<any> {
    return this.http.post(getBaseUrl() + 'projects', value);
  }


  cursorBusy(isTrue: boolean) {
    if (isTrue) {
      document.getElementsByTagName('body')[0].classList.add('cursor-busy');
    } else {
      document.getElementsByTagName('body')[0].classList.remove('cursor-busy');
    }
  }

  deleteProject(projectId: any) {
    return this.http.delete(getBaseUrl() + 'projects/' + projectId);
  }

  updateProject(data: any) {
    const updatedFields = { 'name': data.name, 'config': data.config, 'pics': data.pics };
    return this.http.put(getBaseUrl() + 'projects/' + data.id, updatedFields);
  }

  archiveProject(id: any) {
    return this.http.post(getBaseUrl() + 'projects/' + id + '/archive', '');
  }
  unarchiveProject(id: any) {
    return this.http.post(getBaseUrl() + 'projects/' + id + '/unarchive', '');
  }
  getEnvironmentConfig() {
    return this.http.get(getBaseUrl() + 'projects/default_config');
  }
  uploadPics(data: any, id: any) {
    // eslint-disable-next-line prefer-const
    let formData: FormData = new FormData();
    formData.append('file', data, data.name);
    return this.http.put(getBaseUrl() + 'projects/' + id + '/upload_pics', formData);
  }
  deletePics(data: any, id: any) {
    return this.http.delete(getBaseUrl() + 'projects/' + id + '/pics_cluster_type?cluster_name=' + data);
  }
  getShaVersion() {
    return this.http.get(getBaseUrl() + 'version');
  }
}
