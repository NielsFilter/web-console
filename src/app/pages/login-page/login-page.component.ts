import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Http } from '@angular/http';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { DataService } from '../../services/data.service';
import { ConsoleUser } from '../../classes/consoleUser';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements OnInit {
  username: string;
  password: string;
  platformAddress: string;

  isDisabled = false;

  loading = false;

/**
 * TODO:
 *  adjust width of login component correctly instead of hardcoded
 *  proper way to handle if a user is logged in
 *  cache logged in user details
 *  find a better way to preserve error message height in HTML
 *  localize error messages to the login page instead of the data service
 *  Spinner while waiting for http request to complete
 *  Before loading the page, have a placeholder image (loading-screen component already generated)
 */


  constructor(private router: Router, private http: HttpClient, private dataService: DataService) { }

  ngOnInit() {

  }

  doLogin(): void {
    this.dataService.errorOccurred.occurred = false;
    this.isDisabled = true;
    // Handle empty fields
    if (  (this.username === undefined || (this.username.trim().length === 0)) ||
          (this.password === undefined || (this.password.trim().length === 0)) ||
          (this.platformAddress === undefined || (this.platformAddress.trim().length === 0)) ) {
      console.log('Login Page - Not all required fields were present');
      this.dataService.errorOccurred.occurred = true;
      this.dataService.errorOccurred.errorMessage = 'Please complete all the fields above';
      this.isDisabled = false;
      return;
    }

    // Do login
    this.dataService.login(this.username, this.password, this.platformAddress)
    .then(result => {
      this.isDisabled = false;
    })
    .catch(ex => {
      this.dataService.errorOccurred.occurred = true;
      this.dataService.errorOccurred.errorMessage = 'An error occurred';
      console.log(ex);
      this.isDisabled = false;
    });
  }
}
