import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SearchInputTextComponent } from './search-input-text/search-input-text.component';
import { Button1Component } from './button-1/button-1.component';
import { TextInputComponent } from './text-input/text-input.component';
import { PasswordInputComponent } from './password-input/password-input.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { Button2Component } from './button-2/button-2.component';
import { ManagementPageComponent } from './management-page/management-page.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'management', component: ManagementPageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SearchInputTextComponent,
    Button1Component,
    TextInputComponent,
    PasswordInputComponent,
    LoginPageComponent,
    TopNavComponent,
    DashboardPageComponent,
    Button2Component,
    ManagementPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
