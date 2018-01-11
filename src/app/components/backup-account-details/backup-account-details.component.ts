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
    const percent = this.getCapacityUsed();
    console.log(percent);
   // $('.progress-bar').css('width', `${percent}%`);
  }
  getCapacityUsed(): number {
    const used = this.accountDetails.ProtectedSizeAll / 1073741824);
    const limit = this.accountDetails.Limit / 1024);
    return (used / limit * 100);
  }

}
