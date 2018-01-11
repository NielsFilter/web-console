import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-backup-account-details',
  templateUrl: './backup-account-details.component.html',
  styleUrls: ['./backup-account-details.component.css']
})
export class BackupAccountDetailsComponent implements OnInit {
  @Input() accountDetails: any;
  constructor() { }

  ngOnInit() {
  }

}
