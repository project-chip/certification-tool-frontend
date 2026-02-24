/**
 *
 * Copyright (c) 2026 Project CHIP Authors
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

import { Component, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { WebRTCService } from 'src/app/shared/core_apis/webrtc.service';
import { LOW_AUDIO_THRESHOLD, MEDIUM_AUDIO_THRESHOLD, AUDIO_LEVEL_COLORS } from '../utils';

export interface WebRTCSession {
  remoteStream$: Observable<MediaStream | null>;
  remoteAudioLevel$: Observable<number>;
  localAudioLevel$: Observable<number>;
  connectionState$: Observable<string>;
}

@Component({
  selector: 'app-webrtc-stream',
  templateUrl: './webrtc-stream.component.html',
  styleUrls: ['./webrtc-stream.component.scss']
})
export class WebrtcStreamComponent implements OnDestroy {
  @Input() sessions$!: Observable<WebRTCSession[]>;
  isMicMuted: boolean = false;

  constructor(private webRTCService: WebRTCService) {}

  ngOnDestroy(): void {
    this.webRTCService.closeAllSessions();
  }

  getAudioLevelColor(level: number): string {
    if (level < LOW_AUDIO_THRESHOLD) return AUDIO_LEVEL_COLORS.LOW;
    if (level < MEDIUM_AUDIO_THRESHOLD) return AUDIO_LEVEL_COLORS.MEDIUM;
    return AUDIO_LEVEL_COLORS.HIGH;
  }

  getAudioLevelWidth(level: number): string {
    return `${Math.max(2, level)}%`;
  }

  toggleMicMute(): void {
    const localStream = this.webRTCService.currentLocalStream;
    if (localStream) {
      this.isMicMuted = !this.isMicMuted;
      localStream.getAudioTracks().forEach((track: MediaStreamTrack) => {
        track.enabled = !this.isMicMuted;
      });
    }
  }
}
