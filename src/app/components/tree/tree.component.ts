import { Component, OnInit, Input, Output } from '@angular/core';
import { AccountListComponent } from '../account-list/account-list.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {

  @Input() treeData: any;
  accounts: any;
  accountsLoading = false;

  constructor(private dataService: DataService) { }


  ngOnInit() {

  }

  increment() {
  }

  addGroupButtonClicked(name: string, id: number){
    console.log(`Tree Component - addGroupButtonClicked() was called for ${id}(${name})`);
  }
  removeGroupButtonClicked(name: string, id: number){
    console.log(`Tree Component - removeGroupButtonClicked() was called for ${id}(${name})`);
  }
  groupSettingsButtonClicked(name: string, id: number){
    console.log(`Tree Component - groupSettingsButtonClicked() was called for ${id}(${name})`);
  }
  getBackupAccountsForGroup(name: string, id: number) {
    console.log(`Tree Component - User queried group with id ${id}(${name}) for backup accounts`);

    this.accountsLoading = true;

    this.dataService.getAccountsForGroup(id)
      .then(response => {
        console.log('Tree Component - Fetching accounts successful');
        console.log(response);
        // @ts-ignore: this has some data under the res
        this.accounts = response.data;
      })
      .catch(ex => {
        console.log('Tree Component - Fetching accounts unsuccessful');
      })
      .then(() => {
        this.accountsLoading = false;
      });
  }
}
