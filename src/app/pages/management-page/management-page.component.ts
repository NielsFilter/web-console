import { Component, OnInit, NgZone } from '@angular/core';
import * as _ from 'lodash';
import { DataService } from '../../services/data.service';
import { TreeComponent } from '../../components/tree/tree.component';
import { ConsoleUser } from '../../classes/consoleUser';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-management-page',
  templateUrl: './management-page.component.html',
  styleUrls: ['./management-page.component.css']
})
export class ManagementPageComponent implements OnInit {
  CONTEXT:string = 'Management Page';
  /**
   * TODO
   *  rename this to 'account-management-page'
   * add the Root level as a 'collection'
   * https://codepen.io/aanjulena/pen/ZLZjzV
   */


// testing

  currentUser: any;

  constructor(private logger: LoggerService, private router: Router, private ngZone: NgZone, private dataService: DataService, private userService: UserService) {
  }

  ngOnInit() {
    this.logger.DEBUG(this.CONTEXT, 'page.loaded');
    this.currentUser = this.userService.currentConsoleUser;

    if (!this.currentUser || this.currentUser === undefined || this.currentUser === null) {
      this.logger.WARN(this.CONTEXT, 'user.not.logged.in.rerouting');
      // https://stackoverflow.com/questions/35936535/angular-2-ngoninit-not-called ??
      this.ngZone.run(() => this.router.navigateByUrl('/login'))      
      return;
    }

    this.dataService.fetchGroups();
  }
}
