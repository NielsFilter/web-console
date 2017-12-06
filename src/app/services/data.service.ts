import { Injectable } from '@angular/core';
import { ConsoleUser } from '../classes/consoleUser';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Http } from '@angular/http';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class DataService {
  currentConsoleUser: ConsoleUser;
  loggedIn: Boolean = false;

  constructor(public http: HttpClient) { }

  login(username: string, password: string, platformAddress: string): Promise<any> {
    const credentials = 'Basic ' + btoa(`${username}:${password}`);
    const url = `http://localhost:8080/https://${platformAddress}/api/odata`;
    const headers = new HttpHeaders({
      'Authorization': credentials,
      'Content-Type': 'application/json',
    });

    console.log(`Login Page - Sending login request to ${url}`);
    return this.http.get(url, { headers })
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
                this.currentConsoleUser = user;
                this.loggedIn = true;
              },
              (err: HttpErrorResponse) => {
                console.log('Login Page - Login Unsuccessful');
                console.log(`${err.status} - Error : ${err.statusText}`);
              });
  }

}
