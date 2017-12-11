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

  constructor(private dataService: DataService) { }







  
    ngOnInit() {
  //  this.increment();
 //   console.log('num is ' + this.count);
  }
  increment() {
  //  this.count = this.count + 1;
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
  getBackupAccountsForGroup(name: string, id: number){
    console.log(`Tree Component - User queried group with id ${id}(${name}) for backup accounts`);
    this.dataService.getAccountsForGroup(id);
  }
}
