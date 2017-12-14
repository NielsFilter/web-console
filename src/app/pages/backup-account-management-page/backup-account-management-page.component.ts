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
  CONTEXT:string = 'Backup Account Management Page';
  /**
   * TODO
   *  rename this to 'account-management-page'
   * add the Root level as a 'collection'
   * https://codepen.io/aanjulena/pen/ZLZjzV
   */


// testing



  constructor(private logger: LoggerService, private router: Router, private dataService: DataService, private userService: UserService) {
  }

  ngOnInit() {
    this.logger.DEBUG(this.CONTEXT, 'page.loaded');
    // checks if user is logged in
    if(!this.userService.isUserLoggedIn()){
        return;
    }

    this.dataService.fetchGroups();
  }
}
