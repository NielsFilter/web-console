import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Http } from '@angular/http';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { UserService } from '../../services/user.service';
import { DataService } from '../../services/data.service';
import { ConsoleUser } from '../../classes/consoleUser';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements OnInit {
  CONTEXT = 'Login Page';
  waitingForRequest = false;
  loading = true;

  
  username: string; // 'admin';
  password: string; // 'password';
  platformAddress: string; // '192.168.20.198';

  errorOccurred = false;
  errorMessage = '';

  constructor(
    private logger: LoggerService,
    private router: Router,
    private http: HttpClient,
    private dataService: DataService,
    public userService: UserService) {
  }

  ngOnInit() {
    // loading
    setTimeout(() => {
      this.loading = false;
      this.logger.DEBUG(this.CONTEXT, 'page.loaded');
    },
      3000);
  }

  doLogin(): void {
    this.errorOccurred = false;
    this.waitingForRequest = true;

    // Handle empty fields
    if (
      (this.username === undefined || (this.username.trim().length === 0)) ||
      (this.password === undefined || (this.password.trim().length === 0)) ||
      (this.platformAddress === undefined || (this.platformAddress.trim().length === 0))) {

      this.logger.WARN(this.CONTEXT, 'login.page.empty.fields');
      this.errorOccurred = true;
      this.errorMessage = 'Please complete all the fields above';
      this.waitingForRequest = false;
      return;
    }
    const credentials = 'Basic ' + btoa(`${this.username}:${this.password}`);
    // Send login request login
    this.dataService.login(credentials, this.platformAddress)
      .then(response => {
        this.logger.INFO(this.CONTEXT, 'login.successful', [this.username]);

        const data = response;

        // If no root is specified, use the root group 1 (Storage Platform level)
        let root = 1;
        const rootName = 'Storage Platform';

        // Get the root group for the current user
        // this.logger.TRACE(this.CONTEXT, JSON.stringify(data));
        for (const i in data) {
          if ((data[i].Name).toLowerCase() === this.username.toLowerCase()) {
            root = data[i].AdminBackupGroupId;
          }
        }

        this.logger.TRACE(this.CONTEXT, `User root level is ${root}`);
        const user: ConsoleUser = {
          username: this.username,
          platformAddress: this.platformAddress,
          encryptedCredentials: credentials,
          rootBackupGroupId: root,
          rootBackupGroupName: rootName,
          userInformation: response
        };
        // TODO advanced caching of user
        this.userService.currentConsoleUser = user;
        this.userService.loggedIn = true;
        this.router.navigate(['/dashboard']);

      },
      (err: HttpErrorResponse) => {
        this.logger.ERROR(this.CONTEXT, 'login.unsuccessful', [err.status.toString()]);
        switch (err.status) {
          case 400:
            this.errorMessage = 'Sorry, your login request failed';
            break;

          case 401:
            this.errorMessage = 'Sorry, you are unauthorized to make this request';
            break;

          case 404:
            this.errorMessage = `Sorry, we couldn't find the server you specified`;
            break;

          default:
            this.errorMessage = `Sorry, we could not log you in`;
            break;
        }
        this.errorOccurred = true;
      }).catch(ex => {
        this.errorMessage = `Oops, something went wrong...`;
        this.errorOccurred = true;
      }).then(() => {
        this.waitingForRequest = false;
      });
  }
}
