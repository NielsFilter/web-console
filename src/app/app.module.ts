import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ManagementPageComponent } from './pages/management-page/management-page.component';

import { DataService } from './services/data.service';
import { TreeComponent } from './components/tree/tree.component';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/filter';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'management', component: ManagementPageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    TopNavComponent,
    DashboardPageComponent,
    ManagementPageComponent,
    TreeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
