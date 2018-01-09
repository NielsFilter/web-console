import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { DataService } from '../../services/data.service';
import { TreeComponent } from '../../components/tree/tree.component';
import { ConsoleUser } from '../../classes/consoleUser';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-management-page',
  templateUrl: './backup-account-management-page.component.html',
  styleUrls: ['./backup-account-management-page.component.css']
})
export class BackupAccountManagementPageComponent implements OnInit {
  CONTEXT = 'Backup Account Management Page';
  /**
   * TODO
   * add the Root level as a 'collection'
   * https://codepen.io/aanjulena/pen/ZLZjzV
   */

  loading = false;
  currentGroupAccounts: any;  // accounts for the current group
  currentLevelGroups: any;    // groups and collections for the current collection
  isAdminGroup = true;        // if the current level is a collection
  currentLocationUrlBreadcrumb: any[] = Array();
  currentLocation: any;

  constructor(private logger: LoggerService, private router: Router, private dataService: DataService, private userService: UserService) {
  }

  ngOnInit() {
    this.logger.DEBUG(this.CONTEXT, 'page.loaded');
    // checks if user is logged in
    if (!this.userService.isUserLoggedIn()) {
        return;
    }
    // TODO what if receiving data fails
    this.dataService.getGroupChildren().then(
      data => {
            this.logger.DEBUG(this.CONTEXT, 'data.service.fetching.group.details.successful');
            this.logger.TRACE(this.CONTEXT, 'Received data : \n\n' + JSON.stringify(data));
            const orderedGroups = _.orderBy(data, [function(e){return e.GroupType; }, function(e){return e.Name; }], ['asc', 'asc']);
            // console.log(orderedGroups);
            this.currentLevelGroups = orderedGroups;
          },
          err => {
            this.logger.ERROR(this.CONTEXT, 'data.service.fetching.group.details.unsuccessful');
          }
    );

    this.currentLocation = {
      name: this.userService.currentConsoleUser.rootBackupGroupName,
      id: this.userService.currentConsoleUser.rootBackupGroupId
    };

  }


  breadcrumbNavItemClicked(navItem: any) {
    this.logger.TRACE(this.CONTEXT, 'Breadcrumb nav clicked');

    // changes the location
    this.currentLocation = {
        name: navItem.name,
        id: navItem.id
    };
    // if you navigate to the root level
    if (navItem.id === this.userService.currentConsoleUser.rootBackupGroupId) {
      this.currentLocationUrlBreadcrumb = [];
    }else {
      for (let i = this.currentLocationUrlBreadcrumb.length - 1; i > 0; i--) {
        if (this.currentLocationUrlBreadcrumb[i].id === navItem.id) {
          this.currentLocationUrlBreadcrumb.pop();
          break;
        }else {
          this.currentLocationUrlBreadcrumb.pop();
        }
      }
    }

    // make the request
     this.isAdminGroup = true;
     this.dataService.getGroupChildren(this.currentLocation.id)
     .then(data => {
           this.logger.DEBUG(this.CONTEXT, 'data.service.fetching.group.details.successful');
           this.logger.TRACE(this.CONTEXT, 'Received data : \n\n' + JSON.stringify(data));
           const orderedGroups = _.orderBy(data, [function(e){return e.GroupType; }, function(e){return e.Name; }], ['asc', 'asc']);
           console.log(orderedGroups);
           this.currentLevelGroups = orderedGroups;
         },
         err => {
           this.logger.ERROR(this.CONTEXT, 'data.service.fetching.group.details.unsuccessful');
         }
     );
  }

  addGroupButtonClicked(name: string, id: number) {
    this.logger.TRACE(this.CONTEXT, `addGroupButtonClicked() was called for ${id}(${name})`);
  }

  removeGroupButtonClicked(name: string, id: number) {
    this.logger.TRACE(this.CONTEXT, `removeGroupButtonClicked() was called for ${id}(${name})`);
  }

  groupSettingsButtonClicked(name: string, id: number) {
    this.logger.TRACE(this.CONTEXT, `groupSettingsButtonClicked() was called for ${id}(${name})`);
  }

  adminGroupClicked(name: string, id: number) {
    this.logger.TRACE(this.CONTEXT, `adminGroupClicked() was called for ${id}(${name})`);

    // breadcrumb navigation
    console.log(this.currentLocation);
    this.currentLocationUrlBreadcrumb.push(this.currentLocation);
    this.currentLocation = {
        name: name,
        id: id
    };



    // get current groups
    this.isAdminGroup = true;
    this.dataService.getGroupChildren(id)
    .then(data => {
          this.logger.DEBUG(this.CONTEXT, 'data.service.fetching.group.details.successful');
          this.logger.TRACE(this.CONTEXT, 'Received data : \n\n' + JSON.stringify(data));
          const orderedGroups = _.orderBy(data, [function(e){return e.GroupType; }, function(e){return e.Name; }], ['asc', 'asc']);
          console.log(orderedGroups);
          this.currentLevelGroups = orderedGroups;
        },
        err => {
          this.logger.ERROR(this.CONTEXT, 'data.service.fetching.group.details.unsuccessful');
        }
    );
  }


  // when a group is entered, gets the accounts for that group
  getBackupAccountsForGroup(name: string, id: number) {
    this.logger.TRACE(this.CONTEXT, `User queried group with id ${id}(${name}) for backup accounts`);

    // breadcrumb navigation
    this.currentLocationUrlBreadcrumb.push(this.currentLocation);
    this.currentLocation = {
        name: name,
        id: id
    };

    this.isAdminGroup = false;
    this.loading = true;

    this.dataService.getAccountsForGroup(id)
    .then(data => {
        this.logger.DEBUG(this.CONTEXT, 'tree.fetching.accounts.successful');
        // @ts-ignore: this has some data under the res
        console.log(data.value);
        this.currentGroupAccounts = data.value;
      })
      .catch(ex => {
        // todo : if there was an error
        this.logger.ERROR(this.CONTEXT, 'tree.fetching.accounts.unsuccessful');
      })
      .then(() => {
        this.loading = false;
      });
  }

}
