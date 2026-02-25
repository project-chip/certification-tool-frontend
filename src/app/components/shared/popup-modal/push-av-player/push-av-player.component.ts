/**
 * * Copyright (c) 2026 Project CHIP Authors
 * * Licensed under the Apache License, Version 2.0 (the "License");
 * * you may not use this file except in compliance with the License.
 * * You may obtain a copy of the License at
 * * http://www.apache.org/licenses/LICENSE-2.0
 * * Unless required by applicable law or agreed to in writing, software
 * * distributed under the License is distributed on an "AS IS" BASIS,
 * * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * * See the License for the specific language governing permissions and
 * * limitations under the License.
 */

import { Component, ElementRef, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { TestRunAPI } from 'src/app/shared/core_apis/test-run';
import { environment } from 'src/environments/environment';
import shaka from 'shaka-player';

export interface Stream {
  id: number;
  valid_uploads: { file_path: string }[];
  error_uploads: { file_path: string; reasons?: string[] }[];
}

export interface NonConformingFile {
  file_path: string;
  validation_error_reason: string;
}

@Component({
  selector: 'app-push-av-player',
  templateUrl: './push-av-player.component.html',
  styleUrls: ['./push-av-player.component.scss']
})
export class PushAvPlayerComponent implements OnDestroy, AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  streamSrc: string | null = null;
  streamContents: string[] = [];
  nonConformingFiles: NonConformingFile[] = [];
  currentStream: number | null = null;
  isLiveStream: boolean = false;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  private player!: shaka.Player;

  constructor(private testRunAPI: TestRunAPI) {
    this.loadStreams();
    this.initializeShakaPlayer();
  }

  ngAfterViewInit(): void {
    this.player.attach(this.videoPlayer.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player
        .destroy()
        .then(() => console.log('Shaka player destroyed'))
        .catch((e: shaka.util.Error) => console.error('Failed to destroy Shaka player', e));
    }
  }

  loadStreams(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.testRunAPI.fetchPushAVStreamsList();

    // Check if streams are available after a short delay
    setTimeout(() => {
      const streams = this.testRunAPI.getPushAVStreamsList();
      if (!streams || streams.length === 0) {
        this.errorMessage = 'No video streams available. Click "Refresh Streams" to check for new streams.';
      }
      this.isLoading = false;
    }, 1000);
  }

  updateStreamSrc(streamId: number): void {
    this.errorMessage = null;
    this.isLoading = true;

    const streams: Stream[] = this.testRunAPI.getPushAVStreamsList();
    const stream = streams.find((s) => s.id === streamId);

    if (!stream) {
      this.errorMessage = `Stream with ID ${streamId} not found.`;
      this.isLoading = false;
      return;
    }

    this.streamContents = stream.valid_uploads.map((upload) => upload.file_path);
    this.nonConformingFiles = stream.error_uploads.map((upload) => ({
      file_path: upload.file_path,
      validation_error_reason: upload.reasons ? upload.reasons.join('; ') : ''
    }));

    const streamPath = this.pickEntryPoint(this.streamContents);
    this.currentStream = streamId;

    if (!streamPath) {
      this.errorMessage = `No valid DASH MPD or HLS M3U8 manifest found to play stream ${streamId}. Click "Refresh Streams" and try again.`;
      this.isLoading = false;
      return;
    }

    this.streamSrc = `${environment.testPushAVServerURL}streams/${streamId}/${streamPath}`;
    this.player
      .load(this.streamSrc)
      .then(() => {
        this.isLoading = false;
        if (this.player && typeof this.player.isLive === 'function') {
          this.isLiveStream = this.player.isLive();
        }
      })
      .catch((e: shaka.util.Error) => {
        console.error(`Error loading stream: ${streamId}`, e);
        this.errorMessage = `Failed to load stream ${streamId}. Error: ${e.message || 'Unknown error occurred'}`;
        this.isLoading = false;
      });
  }

  refreshStreams(): void {
    this.streamContents = [];
    this.nonConformingFiles = [];
    this.currentStream = null;
    this.isLiveStream = false;
    this.loadStreams();
  }

  get streams(): Stream[] {
    return this.testRunAPI.getPushAVStreamsList();
  }

  private pickEntryPoint(files: string[]): string | null {
    const mpd = files.find((f) => f.endsWith('.mpd'));
    if (mpd) return mpd;

    const m3u8s = files.filter((f) => f.endsWith('.m3u8'));
    if (m3u8s.length === 0) return null;

    const index = m3u8s.find((f) => f.toLowerCase().includes('index'));
    if (index) return index;

    return m3u8s[0];
  }

  private initializeShakaPlayer(): void {
    this.player = new shaka.Player();
    this.player.configure({
      streaming: {
        bufferingGoal: 30,
        failureCallback: (error: shaka.util.Error) => {
          console.error('Streaming error:', error);
        }
      }
    });
    shaka.polyfill.installAll();
  }
}
