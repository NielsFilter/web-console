import { Component, OnInit, Input, Output } from '@angular/core';
import { AccountListComponent } from '../account-list/account-list.component';
import { DataService } from '../../services/data.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  CONTEXT = 'Tree Component';

  @Input() treeData: any;
  accounts: any;
  accountsLoading = false;

  constructor(private logger: LoggerService, private dataService: DataService) { }


  ngOnInit() {

  }

  increment() {
  }

  addGroupButtonClicked(name: string, id: number){
    this.logger.TRACE(this.CONTEXT,`addGroupButtonClicked() was called for ${id}(${name})`);
  }

  removeGroupButtonClicked(name: string, id: number){
    this.logger.TRACE(this.CONTEXT,`removeGroupButtonClicked() was called for ${id}(${name})`);
  }

  groupSettingsButtonClicked(name: string, id: number){
    this.logger.TRACE(this.CONTEXT,`groupSettingsButtonClicked() was called for ${id}(${name})`);
  }
  
  getBackupAccountsForGroup(name: string, id: number) {
    this.logger.TRACE(this.CONTEXT,`User queried group with id ${id}(${name}) for backup accounts`);

    this.accountsLoading = true;

    this.dataService.getAccountsForGroup(id)
      .then(response => {
        this.logger.DEBUG(this.CONTEXT, 'tree.fetching.accounts.successful');
        
        // @ts-ignore: this has some data under the res
        this.accounts = response.data;
        // this.accounts = response; // for building purposes
      })
      .catch(ex => {
        this.logger.ERROR(this.CONTEXT, 'tree.fetching.accounts.unsuccessful');
      })
      .then(() => {
        this.accountsLoading = false;
      });
  }
}
