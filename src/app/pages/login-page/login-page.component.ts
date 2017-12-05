import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TextInputComponent } from '../../components/text-input/text-input.component';
import { PasswordInputComponent } from '../../components/password-input/password-input.component';
import { Button1Component } from '../../components/button-1/button-1.component';
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
  constructor(private router: Router, private http: HttpClient, private dataService: DataService) { }

  ngOnInit() {

  }

  doLogin(username: string, password: string, platformAddress: string): void {
    const credentials = 'Basic ' + btoa(`${username}:${password}`);
    const url = `http://localhost:8080/https://${platformAddress}/api/odata`;
    const headers = new HttpHeaders({
      'Authorization': credentials,
      'Content-Type': 'application/json',
    });

    console.log(`Login Page - Sending login request to ${url}`);
    this.http.get(url, { headers })
            .toPromise()
            .then( res => {
                console.log('Login Page - Login Successful');
                const user: ConsoleUser = {
                  username : username,
                  platformAddress: platformAddress,
                  encryptedCredentials: credentials
                  } ;
                /*
                this.dataService.currentConsoleUser.platformAddress = platformAddress;
                this.dataService.currentConsoleUser.username = username;
                this.dataService.currentConsoleUser.encryptedCredentials = credentials;
                */
                this.dataService.currentConsoleUser = user;
                this.dataService.loggedIn = true;
                this.router.navigate(['/dashboard']);
              },
              (err: HttpErrorResponse) => {
                console.log('Login Page - Login Unsuccessful');
                console.log(`${err.status} - Error : ${err.statusText}`);
              });
  }

  doSomething(event: any): void {
    console.log('Event triggered!');
      console.log(event);
  }
}
