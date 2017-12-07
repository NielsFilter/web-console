import { Injectable } from '@angular/core';
import { ConsoleUser } from '../classes/consoleUser';

import { HttpClient, HttpParams, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Router } from '@angular/router';
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { race } from 'q';

import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/filter';


@Injectable()
export class DataService {
  currentConsoleUser: ConsoleUser;
  loggedIn: Boolean = false;

  errorOccurred = {
    occurred: false,
    errorMessage: ''
  };

  structuredGroupData: any;

  constructor(public http: HttpClient, public router: Router ) {
  }



  login(username: string, password: string, platformAddress: string): Promise<any> {
    const credentials = 'Basic ' + btoa(`${username}:${password}`);
    const url = `http://192.168.20.198:8080/https://${platformAddress}/api/access/Users`;

    const headers = new HttpHeaders({
      'Authorization': credentials,
      'Content-Type': 'application/json',
    });

    console.log(`DataService - Sending login request to ${url}`);
    return this.http.get(url, { headers })
            .toPromise()
            .then( res => {
                console.log(`DataService - Login Successful, logging is as ${username}`);
                // If no root is specified, use the root group which is 1
                let root = 1;

                // Gets the root group for the current user
                for (const i in res) {
                  if (res[i].Name === username) {
                    root = res[i].AdminBackupGroupId;
                  }
                }

                // Successful login creates user object
                const user: ConsoleUser = {
                  username : username,
                  platformAddress: platformAddress,
                  encryptedCredentials: credentials,
                  rootBackupGroupId: root,
                  userInformation: res
                } ;

                // might need to change this to show when someone is logged in
                this.currentConsoleUser = user;
                this.loggedIn = true;
                this.router.navigate(['/dashboard']);
              },
              (err: HttpErrorResponse) => {
                console.log('DataService - Login Unsuccessful');
                console.log(`${err.status} - Error : ${err.statusText}`);
                this.errorOccurred.occurred = true;

                switch (err.status) {
                  case 400:
                    this.errorOccurred.errorMessage = 'Sorry, your login request failed';
                  break;

                  case 401:
                    this.errorOccurred.errorMessage = 'Sorry, you are unauthorized to make this request';
                  break;

                  case 404:
                    this.errorOccurred.errorMessage = `Sorry, we couldn't find the server you specified`;
                    break;

                  default:
                    this.errorOccurred.errorMessage = `Sorry, but you couldn't be authenticated`;
                    break;
                }
              });
  }


  fetchGroups(): void {
    const url = `http://192.168.20.198:8080/https://${this.currentConsoleUser.platformAddress}/api/backup/Groups`;
    const headers = new HttpHeaders({
      'Authorization': this.currentConsoleUser.encryptedCredentials,
      'Content-Type': 'application/json',
    });


    this.http.get(url, { headers }).subscribe(
      data => {
        console.log('Data Service -Fetching groups successful');
        this.structuredGroupData =  this.getNestedChildren(data, this.currentConsoleUser.rootBackupGroupId);
      },
      err => {
        console.log('Data Service - Something went wrong!');
      }
    );

  }

  getNestedChildren(groups, ParentId) {
    const structuredArray = [];
    for (const group in groups) {
        if (groups[group].ParentId === ParentId) {
          const children = this.getNestedChildren(groups, groups[group].Id);
            if (children.length) {
                groups[group].children = children;
            }
            structuredArray.push(groups[group]);
        }
    }
    return structuredArray;
  }

}
