import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { BackupAccountManagementPageComponent } from './pages/backup-account-management-page/backup-account-management-page.component';
import { ServerManagementComponent } from './pages/server-management/server-management.component';

import { UserService } from './services/user.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/filter';

import { RetryRequestComponentComponent } from './components/retry-request/retry-request.component';
import { BackupAccountDetailsComponent } from './components/backup-account-details/backup-account-details.component';

import * as $ from 'jquery';
import * as bootstrap from "bootstrap";

// our custom modules
import { SpCommsModule } from './sp-comms/sp-comms.module';
import { LoggerModule } from './logger/logger.module';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'accountmanagement', component: BackupAccountManagementPageComponent },
  { path: 'servermanagement', component: ServerManagementComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    TopNavComponent,
    DashboardPageComponent,
    BackupAccountManagementPageComponent,
    LoadingScreenComponent,
    ServerManagementComponent,
    RetryRequestComponentComponent,
    BackupAccountDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    SpCommsModule,
    LoggerModule
  ],
  exports: [ RouterModule ],
  providers: [
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
