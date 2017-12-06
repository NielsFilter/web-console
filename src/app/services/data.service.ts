import { Injectable } from '@angular/core';
import { ConsoleUser } from '../classes/consoleUser';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Http } from '@angular/http';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Router } from '@angular/router';
import { LoginPageComponent } from '../pages/login-page/login-page.component';


@Injectable()
export class DataService {
  currentConsoleUser: ConsoleUser;
  loggedIn: Boolean = false;
  errorMessage = '';

  constructor(public http: HttpClient, public router: Router ) {

  }



  login(username: string, password: string, platformAddress: string): Promise<any> {
    const credentials = 'Basic ' + btoa(`${username}:${password}`);
    const url = `http://localhost:8080/https://${platformAddress}/api/access/Users`;

    const headers = new HttpHeaders({
      'Authorization': credentials,
      'Content-Type': 'application/json',
    });

    console.log(`DataService - Sending login request to ${url}`);
    return this.http.get(url, { headers })
            .toPromise()
            .then( res => {
                console.log('DataService - Login Successful');
                // TODO GET ROOT DIR FROM res
                const root = 1;

                const user: ConsoleUser = {
                  username : username,
                  platformAddress: platformAddress,
                  encryptedCredentials: credentials,
                  rootBackupGroupId: root
                } ;
                console.log(res);
                this.currentConsoleUser = user;
                this.loggedIn = true;
                this.router.navigate(['/dashboard']);
              },
              (err: HttpErrorResponse) => {
                console.log('DataService - Login Unsuccessful');
                console.log(`${err.status} - Error : ${err.statusText}`);
                switch (err.status) {
                  case 400:
                    this.errorMessage = 'Sorry';
                  break;

                  case 401:
                    this.errorMessage = 'Sorry, you are unauthorized to make this request';
                  break;

                  case 404:
                      this.errorMessage = 'Sorry, the requested resource could not be found';
                    break;

                  default:
                    this.errorMessage = `Sorry, but you couldn't be authenticated`;
                    break;
                }
              });
  }

}
