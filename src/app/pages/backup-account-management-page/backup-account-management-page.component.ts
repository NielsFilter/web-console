import { Input, Output, Component, OnInit, EventEmitter } from '@angular/core';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { LoggerService } from '../../services/logger.service';
import * as _ from 'lodash';
import Chart from 'chart.js';
import { BackupAccountDetailsComponent } from '../../components/backup-account-details/backup-account-details.component';

@Component({
  selector: 'app-management-page',
  templateUrl: './backup-account-management-page.component.html',
  styleUrls: ['./backup-account-management-page.component.css']
})
export class BackupAccountManagementPageComponent implements OnInit {
  CONTEXT = 'Backup Account Management Page';
  @Output() accountItemClickedEvent = new EventEmitter<string>();


  @Input()
  backupAccountDetails: BackupAccountDetailsComponent;


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

  loading = false;                                // if the page is loading
  errorOccurred = false;                          // if an error occurred during a request
  currentGroupAccounts: any[] = Array();          // accounts for the current group
  currentLevelGroups: any[] = Array();            // groups and collections for the current collection
  isAdminGroup = true;                            // if the current level is a collection
  currentLocationUrlBreadcrumb: any[] = Array();  // breadcrumbs to the current location
  currentLocation: any;                           // current level the user is viewing

  constructor(
    private logger: LoggerService,
    private dataService: DataService,
    private userService: UserService) {
  }


  ngOnInit() {
    this.logger.DEBUG(this.CONTEXT, 'page.loaded');
    // checks if user is logged in
    if (!this.userService.isUserLoggedIn()) {
      return;
    }

    // on first start up, set the root location to the user's root level
    this.currentLocation = {
      name: this.userService.currentConsoleUser.rootBackupGroupName,
      id: this.userService.currentConsoleUser.rootBackupGroupId
    };
    // get all the groups & collections under the root level
    this.updateCurrentLocation(this.userService.currentConsoleUser.rootBackupGroupId);
  }


  // clicking a breadcrumb item
  breadcrumbNavItemClicked(navItem: any) {
    this.logger.TRACE(this.CONTEXT, `Breadcrumb item '${navItem.name}' clicked`);

    // changes the current location to the clicked item
    this.currentLocation = {
      name: navItem.name,
      id: navItem.id
    };
    // if you navigate to the root level
    if (navItem.id === this.userService.currentConsoleUser.rootBackupGroupId) {
      this.currentLocationUrlBreadcrumb = [];
    } else {
      // remove items until the selected level is reached
      for (let i = this.currentLocationUrlBreadcrumb.length - 1; i > 0; i--) {
        if (this.currentLocationUrlBreadcrumb[i].id === navItem.id) {
          this.currentLocationUrlBreadcrumb.pop();
          break;
        } else {
          this.currentLocationUrlBreadcrumb.pop();
        }
      }
    }
    // get all the groups & collections under the updated location
    this.updateCurrentLocation(this.currentLocation.id);
  }


  // clicking on a collection, navigate into that collection and get its groups & collections
  adminGroupClicked(name: string, id: number) {
    this.logger.TRACE(this.CONTEXT, `adminGroupClicked() was called for ${id}(${name})`);

    // update breadcrumb navigation
    console.log(`Current breadcrumb location : ${this.currentLocation}`);
    this.currentLocationUrlBreadcrumb.push(this.currentLocation);
    this.currentLocation = {
      name: name,
      id: id
    };
    // get current groups
    this.updateCurrentLocation(id);
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


  // user clicked on an account
  accountItemClicked(name: string, id: number): void {
    this.accountDetails = [];

    // get the accounts information
    this.dataService.getAccountDetails(id)
      .then(data => {
        this.logger.DEBUG(this.CONTEXT, 'retrieve.account.details.successful', [id.toString()]);
        this.accountDetails = data.value[0];
        this.logger.TRACE(this.CONTEXT, `Received data : \n\n ${JSON.stringify(this.accountDetails)}`);

        console.log('emitting event');
        this.accountItemClickedEvent.emit(id.toString());
        console.log('opening modal');
        $('#backupAccountExtendedDetails').modal();
      })
      .catch(ex => {
        this.errorOccurred = true;
        this.logger.ERROR(this.CONTEXT, 'retrieve.account.details.unsuccessful', [id.toString()]);
      })
      .then(() => {});
  }


  updateCurrentLocation(id: number): void {
    this.loading = true;
    this.isAdminGroup = true;
    this.currentLevelGroups = [];
    this.dataService.getGroupChildren(id)
      .then(data => {
        this.logger.DEBUG(this.CONTEXT, 'retrieve.group.details.successful', [id.toString()]);
        this.logger.TRACE(this.CONTEXT, 'Received data : \n\n' + JSON.stringify(data));
        const orderedGroups = _.orderBy(data, [function (e) { return e.GroupType; }, function (e) { return e.Name; }], ['asc', 'asc']);
        this.currentLevelGroups = orderedGroups;
      },
      err => {
        this.errorOccurred = true;
        this.logger.ERROR(this.CONTEXT, 'retrieve.group.details.unsuccessful', [id.toString()]);
      }
      ).then(() => { this.loading = false; });
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
        this.logger.DEBUG(this.CONTEXT, 'retrieve.accounts.for.group.successful', [id.toString()]);
        this.currentGroupAccounts = data.value;
        this.logger.TRACE(this.CONTEXT, `Received data : \n\n ${JSON.stringify(this.currentGroupAccounts)}`);
      })
      .catch(ex => {
        this.errorOccurred = true;
        this.logger.ERROR(this.CONTEXT, 'retrieve.accounts.for.group.unsuccessful', [id.toString()]);
      })
      .then(() => { this.loading = false; });
  }

  retryRequest(): void {
    console.log('Retry !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  }

  // when something is typed in the search box
  searchForItem(searchPhrase: string): void {
    if (searchPhrase.length === 0) {
      this.logger.DEBUG(this.CONTEXT, 'search.for.item.skipped');
      return;
    }
    this.loading = true;
    this.dataService.searchForAccounts(searchPhrase)
      .then(data => {
        this.logger.DEBUG(this.CONTEXT, 'search.for.item.successful');
        this.searchResults = data.value;
        this.logger.TRACE(this.CONTEXT, `Received data : \n\n ${JSON.stringify(this.searchResults)}`);
      })
      .catch(ex => {
        this.errorOccurred = true;
        this.logger.ERROR(this.CONTEXT, 'search.for.item.unsuccessful');
      })
      .then(() => { this.loading = false; });
  }
}
