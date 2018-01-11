import { Injectable } from '@angular/core';
import { ConsoleUser } from '../classes/consoleUser';
import { UserService } from './user.service';

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
import { LoggerService } from './logger.service';

@Injectable()
export class DataService {
  CONTEXT = 'Data Service';

  errorOccurred = {
    occurred: false,
    errorMessage: ''
  };

  structuredGroupData: any;

  constructor(public logger: LoggerService, public http: HttpClient, public router: Router, public userService: UserService) {
  }

  // Attempts to log into the AS using the provided credentials
  login(username: string, password: string, platformAddress: string): Promise<any> {
    const credentials = 'Basic ' + btoa(`${username}:${password}`);
    const url = `http://192.168.20.198:8080/https://${platformAddress}/api/access/Users`;

    // TESTING URL
    // const url = `http://${platformAddress}/api/access/Users`;

    const headers = new HttpHeaders({
      'Authorization': credentials,
      'Content-Type': 'application/json',
    });

    this.logger.INFO(this.CONTEXT, 'data.service.sending.login.request', [platformAddress]);
    return this.http.get(url, { headers })
      .toPromise()
      .then(response => {
        this.logger.INFO(this.CONTEXT, 'data.service.login.successful', [username]);
        // @ts-ignore: this has some data under the response
        // const data = response.data;
        const data = response;
        // const data; //for building purposes

        // If no root is specified, use the root group 1 (Storage Platform level)
        let root = 1;
        let rootName = 'Storage Platform';

        // Gets the root group for the current user
        this.logger.TRACE(this.CONTEXT, JSON.stringify(data));
        for (const i in data) {
          if ((data[i].Name).toLowerCase() === username.toLowerCase()) {
            root = data[i].AdminBackupGroupId;
          }
        }
        this.logger.TRACE(this.CONTEXT, `User root level is ${root}`);

        // TODO : check for non-root group
        // check for empty group????
        // if (rootNameTemp.includes('\\')) {
        //   const t = rootNameTemp.indexOf('\\');
        //   rootName = rootNameTemp.substring(0, t);

        // Successful login creates user object
        const user: ConsoleUser = {
          username: username,
          platformAddress: platformAddress,
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
        this.logger.ERROR(this.CONTEXT, 'data.service.login.unsuccessful', [err.status.toString()]);
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



  getGroupChildren(
    groupId: number = this.userService.currentConsoleUser.rootBackupGroupId,
    platformAddress: string = this.userService.currentConsoleUser.platformAddress,
    headers: HttpHeaders = this.userService.getHttpHeaders()): any {

    this.logger.DEBUG(this.CONTEXT, 'data.service.fetching.group.details', [groupId.toString()]);
    const url = `http://192.168.20.198:8080/https://${platformAddress}/api/backup/Groups/${groupId}/groups`;

    return this.http.get(url, { headers })
      .toPromise();
  }


  fetchGroups(): void {
    this.logger.DEBUG(this.CONTEXT, 'data.service.fetching.groups');
    const url = `http://192.168.20.198:8080/https://${this.userService.currentConsoleUser.platformAddress}/api/backup/Groups`;

    // TESTING URL
    // const url = `http://${this.userService.currentConsoleUser.platformAddress}/api/backup/Groups`;
    const headers = this.userService.getHttpHeaders();

    this.http.get(url, { headers }).subscribe(
      data => {
        this.logger.DEBUG(this.CONTEXT, 'data.service.fetching.groups.successful');
        this.logger.TRACE(this.CONTEXT, 'Received data : \n\n' + JSON.stringify(data));
        this.structuredGroupData = this.getNestedChildren(data, this.userService.currentConsoleUser.rootBackupGroupId);
        this.logger.TRACE(this.CONTEXT, 'Structured data : \n\n' + JSON.stringify(this.structuredGroupData));

        this.logger.DEBUG(this.CONTEXT, 'data.service.ordering.groups');
        const orderedGroups = _.orderBy(this.structuredGroupData, function (e) { return e.GroupType; }, ['asc']);
        this.logger.TRACE(this.CONTEXT, 'Ordered data : \n\n' + JSON.stringify(orderedGroups));

        this.structuredGroupData = orderedGroups;
        this.logger.TRACE(this.CONTEXT, 'Structured data : \n\n' + JSON.stringify(this.structuredGroupData));
        this.logger.DEBUG(this.CONTEXT, 'data.service.ordering.groups.successful');
      },
      err => {
        this.logger.ERROR(this.CONTEXT, 'data.service.fetching.groups.unsuccessful');
      }
    );

  }



  getNestedChildren(groups, ParentId) {
    const structuredArray = [];
    for (const group in groups) {
      if (groups[group].ParentId === ParentId) {
        const childrenGroups = this.getNestedChildren(groups, groups[group].Id);
        if (childrenGroups.length) {
          groups[group].childrenGroups = childrenGroups;
        }
        structuredArray.push(groups[group]);
      }
    }
    return structuredArray;
  }



  getAccountsForGroup(groupId: number): any {
    this.logger.DEBUG(this.CONTEXT, 'fetching.accounts.for.group', [groupId.toString()]);
    // tslint:disable-next-line:max-line-length
    const url = `http://192.168.20.198:8080/https://${this.userService.currentConsoleUser.platformAddress}/api/odata/Accounts?$filter=BackupGroupId%20eq%20${groupId}`;


    const headers = this.userService.getHttpHeaders();
    return this.http.get(url, { headers })
      .toPromise();
  }

  getAccountDetails(accountId: number): any {
    this.logger.DEBUG(this.CONTEXT, 'fetching.account.details', [accountId.toString()]);
    // tslint:disable-next-line:max-line-length
    // const url = `http://192.168.20.198:8080/https://${this.userService.currentConsoleUser.platformAddress}/api/backup/Accounts/${accountId}`;
    const url = `http://192.168.20.198:8080/https://${this.userService.currentConsoleUser.platformAddress}/api/odata/Accounts?$filter=Id%20eq%20${accountId}`;
    const headers = this.userService.getHttpHeaders();
    return this.http.get(url, { headers })
      .toPromise();
  }


}
