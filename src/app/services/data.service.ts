import { Injectable } from '@angular/core';
import { ConsoleUser } from '../classes/consoleUser';

import { HttpClient, HttpParams, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Router } from '@angular/router';
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { race } from 'q';
import * as _ from 'lodash';

import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/filter';
import { asTextData } from '@angular/core/src/view';


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
                let rootName = 'Storage Platform';
                // Gets the root group for the current user
                for (const i in res) {
                  if (res[i].Name === username) {
                    root = res[i].AdminBackupGroupId;
                    }
                }

                // TODO : check for non-root group
                // if (rootNameTemp.includes('\\')) {
                //   const t = rootNameTemp.indexOf('\\');
                //   rootName = rootNameTemp.substring(0, t);

                // Successful login creates user object
                const user: ConsoleUser = {
                  username : username,
                  platformAddress: platformAddress,
                  encryptedCredentials: credentials,
                  rootBackupGroupId: root,
                  rootBackupGroupName: rootName,
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
        console.log('Data Service - Fetching groups successful');
        this.structuredGroupData =  this.getNestedChildren(data, this.currentConsoleUser.rootBackupGroupId);

        console.log('Data Service - Ordering groups...');
        const x = _.orderBy(this.structuredGroupData, function(e){return e.GroupType; }, ['asc']);
        this.structuredGroupData = x;
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



  getAccountsForGroup(groupId: number): any[]{
    console.log(`Data Service - Fetching accounts for group ${groupId}`);
    const accountListMock = [
      {
        'Id': 2,
        'Name': 'Account 1',
        'AccountType': 'ESE',
        'Group': 'Group 1',
        'GroupKey': 'group1',
        'Size': 100,
        'Disabled': false,
        'DefaultLimitMB': 1024,
        'StoragePoolId': 1,
        'StoragePool': 'Storage Pool'
      },
      {
        'Id': 4,
        'Name': 'Account 2',
        'AccountType': 'SE',
        'Group': 'Group 1',
        'GroupKey': 'group1',
        'Size': 100,
        'Disabled': false,
        'DefaultLimitMB': 1024,
        'StoragePoolId': 1,
        'StoragePool': 'Storage Pool'
      },
      ,
      {
        'Id': 42,
        'Name': 'Account 3',
        'AccountType': 'DL',
        'Group': 'Group 1',
        'GroupKey': 'group1',
        'Size': 100,
        'Disabled': false,
        'DefaultLimitMB': 1024,
        'StoragePoolId': 1,
        'StoragePool': 'Storage Pool'
      }];

      console.log(accountListMock);
    
    return accountListMock;
  }


}
