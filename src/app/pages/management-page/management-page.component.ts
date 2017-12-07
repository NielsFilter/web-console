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
   */

  rootGroup = 'Storage Platform';
  structuredGroupData = this.dataService.structuredGroupData;

  constructor(private dataService: DataService) {
    // this.dataService.currentConsoleUser = new ConsoleUser('Admin', 'Basic QWRtaW46cGFzc3dvcmQ=', 'jono-pc', 1 , 'GGG', []);
    this.dataService.fetchGroups();
  }

  ngOnInit() {}
}
