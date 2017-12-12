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
        console.log('Data Service - Something went wrong when fetching groups!');
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



  getAccountsForGroup(groupId: number): any[] {
    console.log(`Data Service - Fetching accounts for group ${groupId}`);

    let response: any;

    // tslint:disable-next-line:max-line-length
    const url = `http://192.168.20.198:8080/https://${this.currentConsoleUser.platformAddress}/api/odata/Accounts?$filter=BackupGroupId%20eq%20${groupId}`;

    const headers = new HttpHeaders({
      'Authorization': this.currentConsoleUser.encryptedCredentials,
      'Content-Type': 'application/json',
    });


    this.http.get(url, { headers }).subscribe(
      data => {
        console.log('Data Service - Fetching accounts successful');
        console.log(data);
        response = data;
      },
      err => {
        console.log('Data Service - Something went wrong when fetching accounts!');
      }
    );


    // mock data
    const accountListMock = [
      {
      'Id': 1,
      'BackupGroupId': 2,
      'AccountName': '111231',
      'BackupGroup': 'GROUP1',
      'TypeId': 3,
      'Guid': 'e72fb0e6-b05c-49ca-88a3-52a427e35387',
      'Active': true,
      'BackupEnabled': true,
      'GroupDisabled': false,
      'LastLoginTime': '2017-12-08T08:04:26.623+02:00',
      'Limit': 1024,
      'OverLimit': 0,
      'ForceAdvert': false,
      'AutoUpdate': 0,
      'GroupForceAdvert': false,
      'HardLimit': 1024.000000,
      'AdvertURL': 'Default',
      'DemoGroup': false,
      'Registered': true,
      'CreatedOn': '2017-12-05T15:09:16.86+02:00',
      'DisableGroupOn': null,
      'DisableAccountAfter': 0,
      'DeleteAccountAfter': 0,
      'StorageServer': 'yuki',
      'DisableAccountOn': '2017-12-05T15:09:16.86+02:00',
      'DeleteAccountOn': '2017-12-05T15:09:16.86+02:00',
      'StorageServerPort': 8443,
      'MirrorServer': 'Kaze',
      'MirrorServerPort': 8444,
      'StorageServerGuid': '8067866a-073c-40fb-a531-1c8562cf520b',
      'StorageServerOnline': true,
      'CatchupServerIp': null,
      'CustomMessage': null,
      'ClientLastIP': '192.168.21.250',
      'BackupCount': 3,
      'IndexSize': 15578,
      'SisDisabled': false,
      'SisBehaviour': 1,
      'BackupOperator': false,
      'ClientVersion': '17.12.5.16212',
      'Generation': 3,
      'OnDiskCount': 22,
      'OnDiskCountAll': 22,
      'OnDiskCountDup': 46,
      'OnDiskSize': 10518815,
      'OnDiskSizeDup': 10518815,
      'BriefSizeOnDisk': 0,
      'ProtectedCountLB': 15,
      'ProtectedFolderCountLB': 7,
      'ProtectedSize': 10515981,
      'ProtectedSizeDup': 31542398,
      'ProtectedSizeLB': 10513775,
      'OnDiskPartialSize': 0,
      'OnDiskPartialCount': 0,
      'ProtectedSizeAll': 10515981,
      'SelectedCount': 15,
      'SelectedSize': 10513775,
      'SavingLocalSize': 0,
      'SavingLocalPerc': 0.00,
      'SavingSize': -2834,
      'SavingPerc': -0.03,
      'BriefSize': 0,
      'InfoString': 'gen=3;brandid=A5BP=3.17.1205.16212;protocol=69;licences=3=17.12.5.16212,71;vm=Java HotSpot(TM) 64-Bit Server VM;vmversion=1.8.0.152;os=Windows Server 2016;osversion=10.0;osarch=amd64;osinfo=Windows Server 2016;cpu=4;mem-mb=2437;brandname=Redstor Backup Pro',
      'LastBackupDate': '2017-12-08T08:04:25+02:00',
      'LastMirrorDate': '2017-12-12T09:18:01.64+02:00',
      'RestoreFromMirrorEnabled': false,
      'MirroringEnabled': true,
      'MirrorPriority': 0,
      'HSMEnabled': true,
      'RollupWindowMin': 10,
      'RollupWindowMax': 20,
      'RollupMonthly': true,
      'RollupCount': 1,
      'RollupCountOnMirror': -1,
      'SmallFileThreshold': null,
      'BakReferEnabled': false,
      'OverSpill': 0,
      'NotifyType': null,
      'NotificationEmails': null,
      'NotificationEmailsSender': null,
      'GroupMessage': null,
      'ProfileXML': null,
      'NotifyMessage1': null,
      'NotifyMessage2': null,
      'NotifyMessage3': null,
      'GroupCert': 'Certificate:\n    Data:\n        Version: 3 (0x2)\n        Serial Number: 27296 (0x6aa0)\n        Signature Algorithm: sha256WithRSAEncryption\n        Issuer: C=ZA, ST=Western Cape, L=Stellenbosch, O=Attix5 Ltd, OU=Attix5 Development, CN=Attix5 root /emailAddress=info@attix5.com\n        Validity\n            Not Before: Dec  6 00:00:00 2017 GMT\n            Not After : Oct  2 10:44:18 2020 GMT\n        Subject: C=ZA, ST=Western Cape, L=Stellenbosch, O=Redstor Dev QA, OU=Storage Platform, CN=GROUP1/emailAddress=graeme.keehn@redstor.com\n        Subject Public Key Info:\n            Public Key Algorithm: rsaEncryption\n            RSA Public Key: (1024 bit)\n                Modulus (1024 bit):\n                    00:b0:70:29:1f:13:b3:68:69:1f:a8:76:43:5b:d7:\n                    ec:4d:a3:bd:3f:9c:0d:87:37:7f:f0:64:ab:e9:e4:\n                    60:10:53:7e:b0:12:15:2d:45:80:2a:89:ab:3a:c1:\n                    1b:3d:c4:d3:f7:b1:e8:69:40:0f:88:1a:71:a1:ce:\n                    b4:ae:d3:b1:a2:3e:e3:be:7c:f0:b8:5e:ee:9d:22:\n                    28:50:7e:b3:00:05:a8:cc:46:47:03:d5:32:5c:99:\n                    9c:c3:fe:2a:4a:f6:9e:59:23:15:01:6e:6c:2d:b8:\n                    92:9a:43:92:14:5b:1f:0d:38:30:45:e5:c4:85:56:\n                    75:7e:9e:e2:e6:c3:d5:c7:21\n                Exponent: 65537 (0x10001)\n        X509v3 extensions:\n            X509v3 Basic Constraints: \n                CA:FALSE\n            Netscape Comment: \n                Attix5 Licence Server Certificate\n            X509v3 Subject Key Identifier: \n                C9:03:20:6C:EA:F8:E2:DB:09:49:55:55:86:65:CE:4C:B4:A3:FF:FF\n            X509v3 Authority Key Identifier: \n                keyid:09:3B:8F:02:BF:40:0C:C0:DD:05:92:C9:1E:D7:26:6B:CD:4D:89:D8\n                DirName:/C=ZA/ST=Western Cape/L=Stellenbosch/O=Attix5 Ltd/OU=Attix5 Development/CN=Attix5 root /emailAddress=info@attix5.com\n                serial:00\n\n            X509v3 Extended Key Usage: \n                TLS Web Server Authentication, TLS Web Client Authentication\n            X509v3 CRL Distribution Points: \n                URI:https://licence.attix5.com/crl.txt\n\n    Signature Algorithm: sha256WithRSAEncryption\n        b8:ad:b5:14:93:88:0e:cd:74:a7:66:6c:80:43:4a:b4:71:e4:\n        f2:0d:b7:e1:3e:a9:ef:69:74:72:61:a1:4b:52:c7:5f:a5:5e:\n        4a:f2:9a:65:98:e1:2d:ba:d9:72:ae:97:bc:23:f8:78:17:d1:\n        93:e9:74:df:8f:2e:b9:b8:1b:78:b6:46:59:67:20:1a:ed:7c:\n        b8:33:e7:8f:cf:5a:9a:4f:06:e3:5d:1a:7f:72:5b:22:0e:8c:\n        c3:3d:3c:c3:54:1f:d8:48:14:90:7d:2a:96:0b:51:7b:55:4c:\n        f9:93:cd:40:b6:15:09:42:4d:df:8a:a2:91:83:5b:f7:51:13:\n        d3:60:77:f8:4c:3f:61:e1:ea:b2:a6:c7:13:ab:fd:9c:df:a9:\n        f2:59:de:25:c7:e8:79:76:95:61:7a:e4:44:70:a0:37:0a:2c:\n        a1:83:3d:36:9e:21:a2:1f:92:c2:29:1f:41:92:ee:22:0b:78:\n        e6:ef:2f:66:a5:9b:b0:34:a7:f9:8d:64:a9:a5:68:41:d3:c9:\n        1d:0c:b5:07:95:e4:a4:ca:99:af:01:31:f8:08:55:bb:27:3f:\n        2c:70:c1:b8:17:94:55:e1:86:6c:86:7d:66:11:41:6e:05:06:\n        b0:39:67:88:51:16:54:1f:84:b6:bf:85:b5:fa:4b:40:ee:e1:\n        2f:2f:35:49\n-----BEGIN CERTIFICATE-----\nMIIE0TCCA7mgAwIBAgICaqAwDQYJKoZIhvcNAQELBQAwgaQxCzAJBgNVBAYTAlpB\nMRUwEwYDVQQIEwxXZXN0ZXJuIENhcGUxFTATBgNVBAcTDFN0ZWxsZW5ib3NjaDET\nMBEGA1UEChMKQXR0aXg1IEx0ZDEbMBkGA1UECxMSQXR0aXg1IERldmVsb3BtZW50\nMRUwEwYDVQQDEwxBdHRpeDUgcm9vdCAxHjAcBgkqhkiG9w0BCQEWD2luZm9AYXR0\naXg1LmNvbTAeFw0xNzEyMDYwMDAwMDBaFw0yMDEwMDIxMDQ0MThaMIGpMQswCQYD\nVQQGEwJaQTEVMBMGA1UECBMMV2VzdGVybiBDYXBlMRUwEwYDVQQHEwxTdGVsbGVu\nYm9zY2gxFzAVBgNVBAoTDlJlZHN0b3IgRGV2IFFBMRkwFwYDVQQLExBTdG9yYWdl\nIFBsYXRmb3JtMQ8wDQYDVQQDEwZHUk9VUDExJzAlBgkqhkiG9w0BCQEWGGdyYWVt\nZS5rZWVobkByZWRzdG9yLmNvbTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA\nsHApHxOzaGkfqHZDW9fsTaO9P5wNhzd/8GSr6eRgEFN+sBIVLUWAKomrOsEbPcTT\n97HoaUAPiBpxoc60rtOxoj7jvnzwuF7unSIoUH6zAAWozEZHA9UyXJmcw/4qSvae\nWSMVAW5sLbiSmkOSFFsfDTgwReXEhVZ1fp7i5sPVxyECAwEAAaOCAYgwggGEMAkG\nA1UdEwQCMAAwMAYJYIZIAYb4QgENBCMWIUF0dGl4NSBMaWNlbmNlIFNlcnZlciBD\nZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUyQMgbOr44tsJSVVVhmXOTLSj//8wgdEGA1Ud\nIwSByTCBxoAUCTuPAr9ADMDdBZLJHtcma81NidihgaqkgacwgaQxCzAJBgNVBAYT\nAlpBMRUwEwYDVQQIEwxXZXN0ZXJuIENhcGUxFTATBgNVBAcTDFN0ZWxsZW5ib3Nj\naDETMBEGA1UEChMKQXR0aXg1IEx0ZDEbMBkGA1UECxMSQXR0aXg1IERldmVsb3Bt\nZW50MRUwEwYDVQQDEwxBdHRpeDUgcm9vdCAxHjAcBgkqhkiG9w0BCQEWD2luZm9A\nYXR0aXg1LmNvbYIBADAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwMwYD\nVR0fBCwwKjAooCagJIYiaHR0cHM6Ly9saWNlbmNlLmF0dGl4NS5jb20vY3JsLnR4\ndDANBgkqhkiG9w0BAQsFAAOCAQEAuK21FJOIDs10p2ZsgENKtHHk8g234T6p72l0\ncmGhS1LHX6VeSvKaZZjhLbrZcq6XvCP4eBfRk+l0348uubgbeLZGWWcgGu18uDPn\nj89amk8G410af3JbIg6Mwz08w1Qf2EgUkH0qlgtRe1VM+ZPNQLYVCUJN34qikYNb\n91ET02B3+Ew/YeHqsqbHE6v9nN+p8lneJcfoeXaVYXrkRHCgNwosoYM9Np4hoh+S\nwikfQZLuIgt45u8vZqWbsDSn+Y1kqaVoQdPJHQy1B5XkpMqZrwEx+AhVuyc/LHDB\nuBeUVeGGbIZ9ZhFBbgUGsDlniFEWVB+Etr+FtfpLQO7hLy81SQ==\n-----END CERTIFICATE-----\n',
      'Notes': null,
      'LastBackupStatus': 3,
      'LastBackupMessage': 'Completed with errors'
    },
    {
      'Id': 2,
      'BackupGroupId': 3,
      'AccountName': 'EMMETToadsh',
      'BackupGroup': 'group2',
      'TypeId': 3,
      'Guid': '16717fde-df10-49e2-b0aa-43d7d91cb4ef',
      'Active': true,
      'BackupEnabled': true,
      'GroupDisabled': false,
      'LastLoginTime': null,
      'Limit': 1024,
      'OverLimit': 0,
      'ForceAdvert': false,
      'AutoUpdate': 0,
      'GroupForceAdvert': false,
      'HardLimit': 1024.000000,
      'AdvertURL': 'Default',
      'DemoGroup': false,
      'Registered': true,
      'CreatedOn': '2017-12-12T09:32:51.39+02:00',
      'DisableGroupOn': null,
      'DisableAccountAfter': 0,
      'DeleteAccountAfter': 0,
      'StorageServer': 'yuki',
      'DisableAccountOn': '2017-12-12T09:32:51.39+02:00',
      'DeleteAccountOn': '2017-12-12T09:32:51.39+02:00',
      'StorageServerPort': 8443,
      'MirrorServer': null,
      'MirrorServerPort': null,
      'StorageServerGuid': '8067866a-073c-40fb-a531-1c8562cf520b',
      'StorageServerOnline': true,
      'CatchupServerIp': null,
      'CustomMessage': null,
      'ClientLastIP': '192.168.21.250',
      'BackupCount': null,
      'IndexSize': null,
      'SisDisabled': false,
      'SisBehaviour': 1,
      'BackupOperator': null,
      'ClientVersion': '17.12.5.16212',
      'Generation': 3,
      'OnDiskCount': null,
      'OnDiskCountAll': null,
      'OnDiskCountDup': null,
      'OnDiskSize': null,
      'OnDiskSizeDup': null,
      'BriefSizeOnDisk': null,
      'ProtectedCountLB': null,
      'ProtectedFolderCountLB': null,
      'ProtectedSize': null,
      'ProtectedSizeDup': null,
      'ProtectedSizeLB': null,
      'OnDiskPartialSize': null,
      'OnDiskPartialCount': null,
      'ProtectedSizeAll': 0,
      'SelectedCount': null,
      'SelectedSize': null,
      'SavingLocalSize': 0,
      'SavingLocalPerc': 0.00,
      'SavingSize': 0,
      'SavingPerc': 0.00,
      'BriefSize': null,
      'InfoString': 'gen=3;brandid=A5BP=3.17.1205.16212;protocol=69;licences=3=17.12.5.16212,71;vm=Java HotSpot(TM) 64-Bit Server VM;vmversion=1.8.0.152;os=Windows Server 2016;osversion=10.0;osarch=amd64;osinfo=Windows Server 2016;cpu=4;mem-mb=2384',
      'LastBackupDate': null,
      'LastMirrorDate': null,
      'RestoreFromMirrorEnabled': false,
      'MirroringEnabled': true,
      'MirrorPriority': 0,
      'HSMEnabled': true,
      'RollupWindowMin': 10,
      'RollupWindowMax': 20,
      'RollupMonthly': true,
      'RollupCount': 1,
      'RollupCountOnMirror': -1,
      'SmallFileThreshold': null,
      'BakReferEnabled': false,
      'OverSpill': 0,
      'NotifyType': null,
      'NotificationEmails': null,
      'NotificationEmailsSender': null,
      'GroupMessage': null,
      'ProfileXML': null,
      'NotifyMessage1': null,
      'NotifyMessage2': null,
      'NotifyMessage3': null,
      'GroupCert': null,
      'Notes': null,
      'LastBackupStatus': null,
      'LastBackupMessage': null
    }];

    // console.log(accountListMock);
     response = accountListMock;
     console.log('res');
     console.log(response);
    return response;
  }


}


/*
ACCOUNTS :
**********
GET /api/backup/Accounts
GET /api/backup/Accounts/{id}
PATCH /api/backup/Accounts/{id}
DELETE /api/backup/Accounts/{id}

GROUPS :
********
GET /api/backup/Groups
POST /api/backup/Groups
DELETE /api/backup/Groups/{id}
GET /api/backup/Groups/{id}
PATCH /api/backup/Groups/{id}
PUT /api/backup/Groups/{id} <<< Set the licence allocation

SERVERS :
*********
GET /api/storage/Servers

ODATA

*/



/* servers
[
  {
    "Id": 1,
    "ServerName": "MasterAccountServer",
    "ServerTypeId": 1,
    "ServerGuid": "a1a01cc1-1214-4492-b048-a7f7c60b2b68",
    "IP": "0.0.0.0",
    "Port": 443,
    "OnLine": true,
    "NoNewAccounts": false,
    "CreatedOn": "2017-12-05T13:10:18.333",
    "ModifiedOn": "2017-12-08T08:00:43.117",
    "Deleted": false
  },
  {
    "Id": 2,
    "ServerName": "StorageServer",
    "ServerTypeId": 2,
    "ServerGuid": "3f99d2e8-c8ea-4a39-a97b-9c5a680b597b",
    "StoragePoolId": 1,
    "IP": "kaze",
    "Port": 8443,
    "OnLine": true,
    "NoNewAccounts": false,
    "MirrorCompleted": "2017-12-12T13:17:01.49",
    "CreatedOn": "2017-12-05T13:18:01.247",
    "ModifiedOn": "2017-12-12T11:17:01.83",
    "Deleted": false
  },
  {
    "Id": 3,
    "ServerName": "StorageServer",
    "ServerTypeId": 2,
    "ServerGuid": "8067866a-073c-40fb-a531-1c8562cf520b",
    "StoragePoolId": 1,
    "IP": "yuki",
    "Port": 8443,
    "OnLine": true,
    "NoNewAccounts": false,
    "MirrorCompleted": "2017-12-12T13:18:01.657",
    "CreatedOn": "2017-12-05T13:18:48.52",
    "ModifiedOn": "2017-12-12T11:18:02.607",
    "Deleted": false
  },
  {
    "Id": 4,
    "ServerName": "MirrorServer",
    "ServerTypeId": 5,
    "ServerGuid": "e008d516-f08e-4d3e-9606-18f2f30808f5",
    "IP": "Kaze",
    "Port": 8444,
    "OnLine": true,
    "NoNewAccounts": false,
    "CreatedOn": "2017-12-05T13:30:00.477",
    "ModifiedOn": "2017-12-12T09:33:00.73",
    "Deleted": false
  },
  {
    "Id": 5,
    "ServerName": "MirrorServer",
    "ServerTypeId": 5,
    "ServerGuid": "13af31b6-1236-48f9-bbe4-c5c5bc469290",
    "IP": "Yuki",
    "Port": 8444,
    "OnLine": true,
    "NoNewAccounts": false,
    "CreatedOn": "2017-12-05T13:30:00.67",
    "ModifiedOn": "2017-12-12T09:33:00.76",
    "Deleted": false
  }
]
*/
