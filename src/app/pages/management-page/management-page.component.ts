import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { DataService } from '../../services/data.service';
import { TreeComponent } from '../../components/tree/tree.component';
import { ConsoleUser } from '../../classes/consoleUser';

@Component({
  selector: 'app-management-page',
  templateUrl: './management-page.component.html',
  styleUrls: ['./management-page.component.css']
})
export class ManagementPageComponent implements OnInit {

  /**
   * TODO
   *  rename this to 'account-management-page'
   * add the Root level as a 'collection'
   * https://codepen.io/aanjulena/pen/ZLZjzV
   */


// testing

  currentUser: any;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {

    this.currentUser = this.dataService.currentConsoleUser;

    if (!this.currentUser || this.currentUser === undefined || this.currentUser === null) {
      // this.router.navigate['login'];
      console.log("NO CURRENT USER!!!");
      return;
    }

    this.dataService.fetchGroups();
  }
}
