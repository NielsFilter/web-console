import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  @Input() accountList: any;

  constructor() { }

  ngOnInit() {

  }

}
