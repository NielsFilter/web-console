import { Input, Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { DataService } from '../../services/data.service';
import { TreeComponent } from '../../components/tree/tree.component';
import { ConsoleUser } from '../../classes/consoleUser';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { LoggerService } from '../../services/logger.service';

// import { Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';

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
   * https://www.jonathanbriehl.com/2015/12/15/bootstrap-4-vertical-menu/
   */
  accountDetails: any[] = Array();


  private _searchPhrase;
  @Input() set searchPhrase(value: string) {
       this._searchPhrase = value;
       this.searchForItem(this._searchPhrase);
    }
  searchResults: any[] = Array();

  loading = false;
  errorOccurred = false;
  currentGroupAccounts: any[] = Array();  // accounts for the current group
  currentLevelGroups: any[] = Array();    // groups and collections for the current collection
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
    this.updateCurrentLocation(this.userService.currentConsoleUser.rootBackupGroupId);

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

    // make the request to update the current level groups
    this.updateCurrentLocation(this.currentLocation.id);
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
    console.log(`Current breadcrumb location : ${this.currentLocation}`);
    this.currentLocationUrlBreadcrumb.push(this.currentLocation);
    this.currentLocation = {
        name: name,
        id: id
    };
    // get current groups
    this.updateCurrentLocation(id);
  }

  accountItemClicked(name: string, id: number): void {
    // alert(`Clicked :  ${id}-${name}`);

    this.dataService.getAccountDetails(id)
    .then(data => {
        this.logger.DEBUG(this.CONTEXT, 'fetching.account.details.successful', [id.toString()]);
        // @ts-ignore: this has some data under the res
        this.accountDetails = data.value[0];
        console.log(data.value[0]);
        $('#backupAccountExtendedDetails').modal();
      })
      .catch(ex => {
        // todo : if there was an error
        this.logger.ERROR(this.CONTEXT, 'fetching.account.details.unsuccessful',  [id.toString()]);
      })
      .then(() => {
        this.loading = false;
      });



  }



  updateCurrentLocation(id: number): void {
    this.loading = true;
    this.isAdminGroup = true;
    this.currentLevelGroups = [];
    this.dataService.getGroupChildren(id)
    .then(data => {
          this.logger.DEBUG(this.CONTEXT, 'data.service.fetching.group.details.successful');
          this.logger.TRACE(this.CONTEXT, 'Received data : \n\n' + JSON.stringify(data));
          const orderedGroups = _.orderBy(data, [function(e){return e.GroupType; }, function(e){return e.Name; }], ['asc', 'asc']);
          console.log(orderedGroups);
          this.currentLevelGroups = orderedGroups;
        },
        err => {
          this.errorOccurred = true;
          this.logger.ERROR(this.CONTEXT, 'data.service.fetching.group.details.unsuccessful');
        }
    ).then(() => {this.loading = false; });
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
    this.currentGroupAccounts = [];
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
  retryRequest(): void {
    console.log('Retry');
  }

  searchForItem(searchPhrase: string): void {
    // console.log('Errors : ' + this.errorOccurred);
    // console.log('searchPhrase : ' + this.searchPhrase);
    // console.log('_searchPhrase : ' + this._searchPhrase);



    if (searchPhrase.length === 0) {
      console.log('length was 0');
      return;
    }
    this.loading = true;
    this.dataService.searchForAccounts(searchPhrase)
    .then(data => {
        this.logger.DEBUG(this.CONTEXT, 'Searching for account');
        // @ts-ignore: this has some data under the res
        console.log(data.value);
        this.searchResults = data.value;
      })
      .catch(ex => {
        // todo : if there was an error
        this.logger.ERROR(this.CONTEXT, 'Searching for item unsuccessful');
      })
      .then(() => {
        this.loading = false;
      });
  }

}
