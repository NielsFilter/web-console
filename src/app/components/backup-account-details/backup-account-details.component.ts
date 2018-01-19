import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import Chart from 'chart.js';
import { DataService } from '../../services/data.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-backup-account-details',
  templateUrl: './backup-account-details.component.html',
  styleUrls: ['./backup-account-details.component.css']
})
export class BackupAccountDetailsComponent implements OnInit, AfterViewInit {
  CONTEXT = 'Backup Account Details Component';
  @Input() accountDetails: any;

  errorOccurred = false;
  backupHistoryFound = true;
  backupHistoryData: any[] = Array();


  barOptions = {
    title: {
      display: true
    },
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        display: false,
        ticks: {
          autoSkip: false,
          // maxRotation: 90,
          // minRotation: 90
        }
      }]
    }
  };

// graphs
  ctx_backupSelectedSize: any;
  ctx_backupSentSize: any;
  ctx_backupFileCount: any;
  ctx_backupDuration: any;
  ctx_averageTransferSpeed: any;

  backupFileCountChart: any;
  backupSelectedSizeChart: any;
  backupSentSizeChart: any;



  constructor(
    private logger: LoggerService,
    private dataService: DataService) { }

  ngOnInit() {
    this.logger.DEBUG(this.CONTEXT, 'page.loaded');

    const percent = this.getCapacityUsed();
    // $('.progress-bar').css('width', `${percent}%`);
  }

  ngAfterViewInit() {
    // LOAD CHARTS HERE
    this.ctx_backupSelectedSize = document.getElementById('backupSizeChart');
    this.ctx_backupSentSize = document.getElementById('backupSentSizeChart');
    this.ctx_backupFileCount = document.getElementById('backupFileCountChart');
    this.ctx_backupDuration = document.getElementById('backupDurationChart');

    Chart.defaults.global.defaultColor = 'rgba(179,29,36,1)';// 'rgba(201,33,40,0.2)';
    Chart.defaults.global.borderWidth =  1;

    this.backupFileCountChart = new Chart(this.ctx_backupFileCount, {
      type: 'bar',
      labels: [],
      data: {
        datasets: [{
          data: []
        }]
      },
      options: this.barOptions
    });
    this.backupFileCountChart.options.title.text = 'Number of files backed up';

    this.backupSelectedSizeChart = new Chart(this.ctx_backupSelectedSize, {
      type: 'bar',
      labels: [],
      data: {
        datasets: [{
          data: []
        }]
      },
      options: this.barOptions
    });
    this.backupSelectedSizeChart.options.title.text = 'Backup Selection size';

    this.backupSentSizeChart = new Chart(this.ctx_backupSentSize, {
      type: 'bar',
      labels: [],
      data: {
        datasets: [{
          data: []
        }]
      },
      options: this.barOptions
    });
    this.backupSentSizeChart.options.title.text = 'Backup transfer size';



    this.logger.TRACE(this.CONTEXT, 'updating.charts');
    this.backupFileCountChart.update();
    this.backupSelectedSizeChart.update();
    this.backupSentSizeChart.update();
 }


/*
NewFileCountLB
PatchFileCountLB
NewFileSizeUncLB
PatchSizeLB
*/


  getCapacityUsed(): number {
    const used = this.accountDetails.ProtectedSizeAll / 1073741824;
    const limit = this.accountDetails.Limit / 1024;
    return (used / limit * 100);
  }

  // gets the backup information for a given account
  getBackupHistoryData(backupAccountId: string, numRecords: string = '7'): void {
    this.dataService.getBackupHistory(backupAccountId, numRecords)
      .then(data => {
        this.logger.DEBUG(this.CONTEXT, 'retrieve.backup.history.successful', [backupAccountId]);
        console.log(data.value);

        if (data.value.length === 0) {
          this.logger.DEBUG(this.CONTEXT, 'backup.history.length.was.zero');
          this.backupHistoryFound = false;
          return;
        }
        this.backupHistoryFound = true;
        this.backupHistoryData = data.value;
        this.backupHistoryData.reverse();
        this.logger.TRACE(this.CONTEXT, 'Received data : \n\n' + JSON.stringify(this.backupHistoryData));



        // EXTRACT DATA FOR GRAPHS
        const backupDates = this.backupHistoryData.map(a => this.dataService.formatTime(a.BackupTime));
        const selectedFileCount = this.backupHistoryData.map(a => a.SelectedCount);
        const backupDuration = this.backupHistoryData.map(a => a.BackupTime);

        const backupTransferSize = this.backupHistoryData.map(a => this.dataService.bytesToGB(a.TotReceivedSizeCompLB));
        const selectedSize = this.backupHistoryData.map(a => this.dataService.bytesToGB(a.SelectedSize));
        const averageTransferSpeed = this.backupHistoryData.map(a => this.dataService.formatBytes(a.BytesRecvPerSec, 2));


        // ASSIGN DATA

        // number of files selected
        this.backupFileCountChart.data.labels = backupDates;
        this.backupFileCountChart.data.datasets[0].data = selectedFileCount;

        // size of files in selection
        this.backupSelectedSizeChart.data.labels = backupDates;
        this.backupSelectedSizeChart.data.datasets[0].data = selectedSize;

        // size of data transferred
        this.backupSentSizeChart.data.labels = backupDates;
        this.backupSentSizeChart.data.datasets[0].data = backupTransferSize;


        // UPDATE GRAPHS
        this.logger.TRACE(this.CONTEXT, 'updating.charts');
        this.backupFileCountChart.update();
        this.backupSelectedSizeChart.update();
        this.backupSentSizeChart.update();


      })
      .catch(ex => {
        this.errorOccurred = true;
        this.logger.ERROR(this.CONTEXT, 'retrieve.backup.history.unsuccessful', [backupAccountId]);
      })
      .then(() => {});


      // console.log('after : ' + this.backupFileCountChart.data.labels);
      // console.log('after : ' + this.backupFileCountChart.data.datasets[0].data);
      // console.log(this.backupFileCountChart.data.datasets[0].data);
  }


}
