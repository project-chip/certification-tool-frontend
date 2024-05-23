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
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MenubarModule } from 'primeng/menubar';
import { StyleClassModule } from 'primeng/styleclass';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { SplitButtonModule } from 'primeng/splitbutton';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { ProjectDetailsComponent } from './components/project/project-details/project-details.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DeviceDetailListComponent } from './components/project/device-detail-list/device-detail-list.component';
import { ProjectComponent } from './components/project/project.component';
import { DeviceDetailComponent } from './components/project/device-detail/device-detail.component';
import { TopNavComponent } from './components/nav/top-nav/top-nav.component';
import { MainAreaComponent } from './components/main-area/main-area.component';
import { SideNavComponent } from './components/nav/side-nav/side-nav.component';
import { CreateNewProjectComponent } from './components/project/create-new-project/create-new-project.component';
import { ProjectService } from './shared/project-utils';
import { ProjectsAPI } from './shared/core_apis/project';
import { MobxAngularModule } from 'mobx-angular';
import { ProjectTableComponent } from './components/project/project-table/project-table.component';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageService } from 'primeng/api';
import { NavSandbox } from './components/nav/nav.sandbox';
import { MainAreaSandbox } from './components/main-area/main-area.sandbox';
import { TestComponent } from './components/test/test.component';
import { TestDetailsComponent } from './components/test/test-details/test-details.component';
import { TabViewModule } from 'primeng/tabview';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProjectSandbox } from './components/project/project.sandbox';
import { TestCaseCategoryComponent } from './components/test/test-case-category/test-case-category.component';
import { TestCasesComponent } from './components/test/test-case-category/test-cases/test-cases.component';
import { TestSuitesListComponent } from './components/test/test-case-category/test-cases/test-suites-list/test-suites-list.component';
import { TestCasesListComponent } from './components/test/test-case-category/test-cases/test-cases-list/test-cases-list.component';
import { TestSummaryComponent } from './components/test/test-case-category/test-summary/test-summary.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { TreeModule } from 'primeng/tree';
import { TestSandbox } from './components/test/test.sandbox';
import { TestSummarySandbox } from './components/test/test-case-category/test-summary/test-summary.sandbox';
import { TooltipModule } from 'primeng/tooltip';
import { TestExecutionComponent } from './components/test/test-execution/test-execution.component';
import { TestExecutionTreeComponent } from './components/test/test-execution/test-execution-tree/test-execution-tree.component';
import { TestLogsComponent } from './components/test/test-execution/test-logs/test-logs.component';
import { TestLogToolbarComponent } from './components/test/test-execution/test-logs/test-log-toolbar/test-log-toolbar.component';
import { TestLogConsoleComponent } from './components/test/test-execution/test-logs/test-log-console/test-log-console.component';
import { TestRunAPI } from './shared/core_apis/test-run';
import { TestRunService } from './shared/test-run-utils';
import { PopupModalComponent } from './components/shared/popup-modal/popup-modal.component';
import { SharedAPI } from './shared/core_apis/shared';
import { TestExecutionHistoryComponent } from './components/test/test-execution-history/test-execution-history.component';
import { DatePipe } from '@angular/common';
import { TestExecutionSandbox } from './components/test/test-execution/test-execution.sandbox';
import { WebSocketAPI } from './shared/core_apis/websocket';
import { ListboxModule } from 'primeng/listbox';
import { CreateNewTestRunComponent } from './components/test/create-new-test-run/create-new-test-run.component';
import { UtilityComponent } from './components/utility/utility.component';
import { SharedService } from './shared/core_apis/shared-utils';
import { FileUploadModule } from 'primeng/fileupload';
import { UploadFileComponent } from './components/utility/upload-file/upload-file.component';
import { UtilityCategoryComponent } from './components/utility/utility-category.component';
import { PerformanceTestsComponent } from './components/utility/performance-tests/performance-tests.component';
import { PerformanceTestCasesListComponent } from './components/utility/performance-tests/performance-test-cases/performance-test-cases-list/performance-test-cases-list.component';
import { PerformanceTestExecutionComponent } from './components/utility/performance-tests/performance-test-execution/performance-test-execution.component';
import { PerformanceTestExecutionHistoryComponent } from './components/utility/performance-tests/performance-test-execution-history/performance-test-execution-history.component';
import { PerformanceTestLogsComponent } from './components/utility/performance-tests/performance-test-execution/performance-test-logs/performance-test-logs.component';
import { PerformanceTestLogToolbarComponent } from './components/utility/performance-tests/performance-test-execution/performance-test-logs/performance-test-log-toolbar/performance-test-log-toolbar.component';
import { CreateNewPerformanceTestRunComponent } from './components/utility/performance-tests/create-new-performance-test-run/create-new-performance-test-run.component';
import { PerformanceTestSuitesListComponent } from './components/utility/performance-tests/performance-test-cases/performance-test-suites-list/performance-test-suites-list.component';
import { PerformanceTestExecutionTreeComponent } from './components/utility/performance-tests/performance-test-execution/performance-test-execution-tree/performance-test-execution-tree.component';
import { PerformanceTestExecutionTreeDetailsComponent } from './components/utility/performance-tests/performance-test-execution/performance-test-execution-tree/performance-test-execution-tree-details/performance-test-execution-tree-details.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { SettingsComponent } from './components/settings/settings.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { TestOperatorComponent } from './components/test/test-operator/test-operator.component';
import { HighlightSearchPipe } from './components/shared/pipes/highlight-search.pipe';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';
import { DndDirective } from './shared/dnd.directive';
@NgModule({
  imports: [
    BrowserModule,
    TableModule,
    HttpClientModule,
    FormsModule,
    CardModule,
    InputTextModule,
    FlexLayoutModule,
    DropdownModule,
    BrowserAnimationsModule,
    CheckboxModule,
    PasswordModule,
    ToggleButtonModule,
    ButtonModule,
    MenubarModule,
    StyleClassModule,
    SharedModule,
    BadgeModule,
    SplitButtonModule,
    MobxAngularModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    ConfirmDialogModule,
    RadioButtonModule,
    TabViewModule,
    InputNumberModule,
    TreeModule,
    TooltipModule,
    ProgressBarModule,
    DialogModule,
    ProgressSpinnerModule,
    ListboxModule,
    FileUploadModule,
    DynamicDialogModule,
    OverlayPanelModule,
    AutoCompleteModule,
    MultiSelectModule,
    KeyFilterModule,
    InputTextareaModule,
    DividerModule,
  ],
  declarations: [
    AppComponent,
    ProjectDetailsComponent,
    DeviceDetailListComponent,
    ProjectComponent,
    DeviceDetailComponent,
    TopNavComponent,
    MainAreaComponent,
    SideNavComponent,
    CreateNewProjectComponent,
    ProjectTableComponent,
    TestComponent,
    TestDetailsComponent,
    TestCaseCategoryComponent,
    TestCasesComponent,
    TestSuitesListComponent,
    TestCasesListComponent,
    TestSummaryComponent,
    TestExecutionComponent,
    TestExecutionTreeComponent,
    TestLogsComponent,
    TestLogToolbarComponent,
    TestLogConsoleComponent,
    PopupModalComponent,
    TestExecutionHistoryComponent,
    CreateNewTestRunComponent,
    UtilityComponent,
    UploadFileComponent,
    PerformanceTestsComponent,
    UtilityCategoryComponent,
    PerformanceTestCasesListComponent,
    PerformanceTestExecutionComponent,
    PerformanceTestExecutionHistoryComponent,
    PerformanceTestLogsComponent,
    PerformanceTestLogToolbarComponent,
    CreateNewPerformanceTestRunComponent,
    PerformanceTestSuitesListComponent,
    PerformanceTestExecutionTreeComponent,
    PerformanceTestExecutionTreeDetailsComponent,
    SettingsComponent,
    TestOperatorComponent,
    HighlightSearchPipe,
    DndDirective,
  ],
  bootstrap: [AppComponent],
  providers: [ProjectService, SharedService, ProjectsAPI, SharedAPI, TestRunService,
    TestRunAPI, MessageService, ConfirmationService, NavSandbox,
    MainAreaSandbox, ProjectSandbox, TestSandbox, TestSummarySandbox,
    TestExecutionSandbox, WebSocketAPI, DialogService, DatePipe]
})
export class AppModule { }
