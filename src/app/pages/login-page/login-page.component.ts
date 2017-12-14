import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Http } from '@angular/http';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { DataService } from '../../services/data.service';
import { ConsoleUser } from '../../classes/consoleUser';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements OnInit {
  CONTEXT:string = 'Login Page';
  waitingForRequest = false;
  loading = true;
  
  username: string;
  password: string;
  platformAddress: string;



/**
 * TODO:
 *  adjust width of login component correctly instead of hardcoded
 *  cache logged in user details
 *  localize error messages to the login page instead of the data service
 */


  constructor(private logger: LoggerService, private router: Router, private http: HttpClient, private dataService: DataService) { }

  ngOnInit() {
    setTimeout(()=>{  this.loading = false; 
                      this.logger.DEBUG(this.CONTEXT, 'page.loaded');}, 
                      5000);    
  }

  doLogin(): void {
    this.dataService.errorOccurred.occurred = false;
    this.waitingForRequest = true;
    
    // Handle empty fields
    if (  (this.username === undefined || (this.username.trim().length === 0)) ||
          (this.password === undefined || (this.password.trim().length === 0)) ||
          (this.platformAddress === undefined || (this.platformAddress.trim().length === 0)) ) {

      this.logger.WARN(this.CONTEXT, 'login.page.empty.fields');

      this.dataService.errorOccurred.occurred = true;
      this.dataService.errorOccurred.errorMessage = 'Please complete all the fields above';
      this.waitingForRequest = false;
      return;
    }

    // Send login request login
    this.dataService.login(this.username, this.password, this.platformAddress)
    .then(result => {
    })
    .catch(ex => {
      this.dataService.errorOccurred.occurred = true;
      this.dataService.errorOccurred.errorMessage = 'An error occurred';
      this.logger.WARN(this.CONTEXT, ex);
      
    }).then(() =>{
      this.waitingForRequest = false;
    });
  }
}