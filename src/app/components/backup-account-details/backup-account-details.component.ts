import { Component, OnInit, Input } from '@angular/core';
import Chart from 'chart.js';
import { DataService } from '../../services/data.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-backup-account-details',
  templateUrl: './backup-account-details.component.html',
  styleUrls: ['./backup-account-details.component.css']
})
export class BackupAccountDetailsComponent implements OnInit {
  CONTEXT = 'Backup Account Details Component';
  @Input() accountDetails: any;

  backupHistoryFound = true;
  backupHistoryData: any[] = Array();

  constructor(private logger: LoggerService, private dataService: DataService) { }

  ngOnInit() {
    this.logger.DEBUG(this.CONTEXT, 'page.loaded');
    // this.getBackupHistoryData(this.accountDetails.Id, '7');


    const percent = this.getCapacityUsed();
    console.log(percent);
    // $('.progress-bar').css('width', `${percent}%`);
  }

  getCapacityUsed(): number {
    const used = this.accountDetails.ProtectedSizeAll / 1073741824;
    const limit = this.accountDetails.Limit / 1024;
    return (used / limit * 100);
  }


  getBackupHistoryData(backupAccountId: string, numRecords: string = '7'): void {
    console.log('records to get : ' + numRecords);
    console.log('Id : ' + backupAccountId);


    this.logger.DEBUG(this.CONTEXT, 'fetch.backup.history', [backupAccountId]);
    this.dataService.getBackupHistory(backupAccountId, numRecords)
      .then(data => {
        this.logger.DEBUG(this.CONTEXT, 'fetch.backup.history.successful');
        console.log(data.value);

        this.backupHistoryData = data.value;
        (this.backupHistoryData.length === 0) ? this.backupHistoryFound = false : this.backupHistoryFound = true;
        console.log('history length: ' + this.backupHistoryData.length);
        console.log('Found history: ' + this.backupHistoryFound);
      })
      .catch(ex => {
        // todo : if there was an error
        this.logger.ERROR(this.CONTEXT, 'fetch.backup.history.unsuccessful');
      })
      .then(() => {
        //  this.loading = false;
      });

    // update graphs
    // const backupDates = this.backupHistoryData.map(a => this.dataService.formatTime(a.BackupTime));
    const backupDates = this.backupHistoryData.map(a => this.dataService.formatTime(a.BackupTime));
    const fileCount = this.backupHistoryData.map(a => a.SelectedCount);
     const backupDuration = this.backupHistoryData.map(a => a.BackupTime);
    const backupSize = this.backupHistoryData.map(a => a.SelectedCount);
    const sentSize = this.backupHistoryData.map(a => this.dataService.bytesToGB(a.TotReceivedSizeCompLB));
    const selectedSize = this.backupHistoryData.map(a => this.dataService.bytesToGB(a.SelectedSize));

    // const sentSize = this.backupHistoryData.map(a => a.TotReceivedSizeCompLB);
    // const selectedSize = this.backupHistoryData.map(a => a.SelectedSize);

      console.log(sentSize);
      console.log(selectedSize);



    this.getBackupFileCountHistory(backupDates, fileCount);
    this.getBackupDurationHistory();
    this.getBackupSizeHistory(backupDates, selectedSize);
    this.getBackupSentSizeHistory(backupDates, sentSize);
  }

  getBackupSizeHistory(backupDates: any, data: any) {
    const ctx = document.getElementById('backupSizeChart');
    const backupSizeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: backupDates,
        datasets: [{
          label: 'Backup Selected Size',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
    backupSizeChart.update();
  }
  getBackupSentSizeHistory(backupDates: any, data: any) {
    const ctx = document.getElementById('backupSentSizeChart');
    const backupSentSizeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: backupDates,
        datasets: [{
          label: 'Backup Transfer Size',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
    backupSentSizeChart.update();
  }

  getBackupFileCountHistory(backupDates: any, data: any) {
    const ctx = document.getElementById('backupFileCountChart');
    const backupFileCountChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: backupDates,
        datasets: [{
          label: 'Backup File Count',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
    backupFileCountChart.update();
  }

  getBackupDurationHistory() {
  const ctx = document.getElementById('backupDurationChart');
    const backupFileCountChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['ESE', 'SE', 'DL'],
        datasets: [{
          label: 'Backup accounts',
          data: [162, 283, 193],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)'

          ],
          borderColor: [
            'rgba(255,99,132,1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
    backupFileCountChart.update();
  }



}
