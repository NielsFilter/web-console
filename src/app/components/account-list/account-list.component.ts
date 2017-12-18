import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { LoggerService } from '../../services/logger.service';
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  CONTEXT = 'Account List Component';

  @Input() accountList: any;

  constructor(private logger: LoggerService) { }

  ngOnInit() {
    this.logger.DEBUG(this.CONTEXT, 'page.loaded');
  }

}
