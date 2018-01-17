import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { LoggerService } from './logger.service';

import { HttpClient, HttpParams, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { race } from 'q';
import * as _ from 'lodash';

import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/filter';
import { asTextData } from '@angular/core/src/view';

import { SelectControlValueAccessor } from '@angular/forms/src/directives/select_control_value_accessor';

@Injectable()
export class DataService {
  CONTEXT = 'Data Service';

  structuredGroupData: any;

  constructor(
    public logger: LoggerService,
    public http: HttpClient,
    public router: Router,
    public userService: UserService) {
  }

  // Attempts to log into the AS using the provided credentials
  login(credentials: string, platformAddress: string): Promise<any> {
    // const credentials = 'Basic ' + btoa(`${username}:${password}`);
    const url = `http://192.168.20.198:8080/https://${platformAddress}/api/access/Users`;
    const headers = new HttpHeaders({
      'Authorization': credentials,
      'Content-Type': 'application/json',
    });
    this.logger.INFO(this.CONTEXT, 'data.service.sending.login.request', [platformAddress]);
    return this.http.get(url, { headers })
      .toPromise();
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
    const url = `http://192.168.20.198:8080/https://${this.userService.currentConsoleUser.platformAddress}/api/odata/Accounts?$filter=Id%20eq%20${accountId}`;
    const headers = this.userService.getHttpHeaders();
    return this.http.get(url, { headers })
      .toPromise();
  }

  // search for accounts that contain
  searchForAccounts(filter: string): any {
    this.logger.TRACE(this.CONTEXT, 'search.for.accounts', [filter.toString()]);
    // group also
    // tslint:disable-next-line:max-line-length
    // const url = `http://192.168.20.198:8080/https://${this.userService.currentConsoleUser.platformAddress}/api/odata/Accounts?$filter=contains(AccountName,${filter}) eq true and contains(BackupGroup,${group})`;
    // tslint:disable-next-line:max-line-length
    const url = `http://192.168.20.198:8080/https://${this.userService.currentConsoleUser.platformAddress}/api/odata/Accounts?$filter=contains(AccountName,'${filter}') eq true`;
    const headers = this.userService.getHttpHeaders();
    return this.http.get(url, { headers })
      .toPromise();
  }

  // get the backup history for an account
  getBackupHistory(accountId: string, numRecords: string): any {
    let selectedRecords = '';
    if (numRecords === '0' || numRecords === undefined) {
    } else {
      selectedRecords = `&$top=${numRecords}`;
    }
    // tslint:disable-next-line:max-line-length
    const url = `http://192.168.20.198:8080/https://${this.userService.currentConsoleUser.platformAddress}/api/odata/Backups?$filter=AccountId%20eq%20${accountId}${selectedRecords}&$orderby=BackupTime%20desc`;
    console.log(url);
    const headers = this.userService.getHttpHeaders();
    return this.http.get(url, { headers })
      .toPromise();
  }


  // FORMAT DATA

  // value, decimal points - got from stackoverflow
  formatBytes(a, b) {
    if (0 === a) { return '0 Bytes'; }
    const c = 1024, d = b || 2, e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f];
  }

  formatTime(time) {
    return new Date(time).toLocaleString();
  }

  bytesToGB(value: number) {
    return (value / 1073741824).toFixed(2);
  }
}
