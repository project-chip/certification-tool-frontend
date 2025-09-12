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
import { Injectable } from '@angular/core';
import { SharedAPI } from 'src/app/shared/core_apis/shared';
import { TestRunAPI } from 'src/app/shared/core_apis/test-run';
import { DEFAULT_POPUP_OBJECT, EXECUTION_STATUS_COMPLETED } from 'src/app/shared/utils/constants';
import { DataService } from 'src/app/shared/web_sockets/ws-config';

@Injectable()
export class TestExecutionSandbox {
  message: any = '';
  constructor(private dataService: DataService, public sharedAPI: SharedAPI, public testRunAPI: TestRunAPI) { }


  showExecutionPrompt(promptData: any) {
    // Converting the prompt BE json to component required JSON format.
    const promptType = promptData.type;
    const popupObject = {
      popupId: '',
      subHeader: promptData.payload.prompt,
      header: ' ',
      buttons: [] as any,
      inputItems: [] as any,
      messageId: promptData.payload.message_id,
      imgHexStr: "" as string
    };
    const buttons = [
      {
        id: 1,
        label: 'Submit',
        class: 'buttonYes',
        callback: this.onYesClick.bind(this)
      }
    ];

    if (promptType === 'message_request') { // Displaying the message popup
      popupObject.popupId = 'TEXTBOX_' + promptData.payload.message_id;
    } else if (
      [
        "options_request",
        "stream_verification_request",
        "image_verification_request",
        "two_way_talk_verification_request",
        "push_av_stream_verification_request",
      ].includes(promptType)
    ) {
      const options = Object.entries(promptData.payload.options).map(([key, value]) => ({ key: value, value: key }));
      const inputItems = [
        {
          id: 1,
          type: 'radioButton',
          value: '',
          groupName: 'group_1',
          options: options
        }
      ];
      switch (promptType) {
        case "push_av_stream_verification_request":
          popupObject.popupId = 'PUSH_';
          break;

        case "stream_verification_request":
          popupObject.popupId = 'STREAM_';
          break;

        case "image_verification_request":
          popupObject.popupId = 'IMAGE_';
          popupObject.imgHexStr = promptData.payload.image_hex_str
          break;

        case "two_way_talk_verification_request":
          popupObject.popupId = "TWO_WAY_TALK_";
          break;

        default:
          popupObject.popupId = 'RADIO_';
      }
      popupObject.popupId += promptData.payload.message_id;
      popupObject.inputItems = inputItems;
      popupObject.buttons = buttons;
    } else if (promptData.payload.placeholder_text) { // Displaying the text field popup
      popupObject.popupId = 'TEXTBOX_' + promptData.payload.message_id;
      const inputItems = [
        { id: 1,
          type: 'inputbox',
          value: promptData.payload.default_value,
          placeHolder: promptData.payload.placeholder_text
        }
      ];
      popupObject.inputItems = inputItems;
      popupObject.buttons = buttons;
    } else if (promptType === 'file_upload_request') { // Displaying the file upload popup
      popupObject.popupId = 'FILE_UPLOAD_' + promptData.payload.message_id;
      const inputItems = [
        { id: 1,
          type: 'file_upload',
          value: ''
        }
      ];
      popupObject.inputItems = inputItems;
      popupObject.buttons = buttons;
    }
    this.sharedAPI.setCustomPopupData(popupObject);
    this.sharedAPI.setShowCustomPopup(popupObject.popupId);
  }

  // This function will be called when user submit the popup.
  onYesClick(inputData: any, messageId: number, file: File) {
    this.sharedAPI.setShowCustomPopup('');
    this.sharedAPI.setCustomPopupData(DEFAULT_POPUP_OBJECT);
    if (inputData[0].type === 'file_upload') {
      this.message = messageId;
      this.testRunAPI.fileUpload(file, this.fileUploadCallback.bind(this));
    } else {
      /* eslint-disable @typescript-eslint/naming-convention */
      const promptResponse = {
        'type': 'prompt_response', 'payload':
          { 'response': inputData[0].value, 'status_code': 0, 'message_id': messageId }
      };
      /* eslint-enable @typescript-eslint/naming-convention */
      this.dataService.send(promptResponse);
    }
  }

  fileUploadCallback(status: any) {
    /* eslint-disable @typescript-eslint/naming-convention */
    const promptResponse = {
      'type': 'prompt_response', 'payload':
        { 'response': ' ', 'status_code': 0, 'message_id': this.message }
    };
    /* eslint-enable @typescript-eslint/naming-convention */
    this.dataService.send(promptResponse);
  }

  // Update Test execution status JSON using websocket data of particular testcase/suits data
  updateJSONBasedOnWebSocketData(testData: any, statusJson: any) {
    const suiteData = statusJson.payload.body;
    if (statusJson.payload.body.test_suite_execution_index > -1) {
      if (suiteData.test_step_execution_index > -1) {
        testData[suiteData.test_suite_execution_index].children[suiteData.test_case_execution_index].
          children[suiteData.test_step_execution_index].status = suiteData.state;
      } else if (suiteData.test_case_execution_index > -1) {
        testData[suiteData.test_suite_execution_index].children[suiteData.test_case_execution_index].status = suiteData.state;
        testData[suiteData.test_suite_execution_index].children[suiteData.test_case_execution_index].analytics = suiteData.analytics;
      } else {
        testData[suiteData.test_suite_execution_index].status = statusJson.payload.body.state;
      }
      const updatedChild = testData[suiteData.test_suite_execution_index].children;
      testData[suiteData.test_suite_execution_index].progress = Math.round(updatedChild.filter(
        (elem: any) => EXECUTION_STATUS_COMPLETED.includes(elem.status)).length / updatedChild.length * 100);
    }
    return testData;
  }
}
