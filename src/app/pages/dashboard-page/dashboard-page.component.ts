import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from '../../services/logger.service';
import { UserService } from '../../services/user.service';
import { Title } from '@angular/platform-browser/src/browser/title';
// import { Chart } from 'chart.js';
import Chart from 'chart.js';
import { ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit, AfterViewInit {
  CONTEXT = 'Dashboard Page';
  constructor(private logger: LoggerService, private router: Router, private userService: UserService) { }

  errorsPresent = true;

  // https://stackoverflow.com/questions/14387673/odata-date-greater-than-filter
  // mock data
  widgets = [
    {
      title: 'Number of offline servers',
      subtitle: '',
      displayType: 'VALUE',
      data: 3
    }, {
      title: 'Failed backups',
      subtitle: 'within the last 24 hours',
      displayType: 'VALUE',
      data: 24
    }, {
      title: 'Backup accounts over limit',
      subtitle: 'This includes softlimit',
      displayType: 'LIST',
      data: [
        {name: 'Account 1', size: '1gb', overlimit: '1.5gb'},
        {name: 'Account 2', size: '20gb', overlimit: '5gb'},
        {name: 'Account 3', size: '1.4gb', overlimit: '4gb'}]
    }, {
      title: 'Backup accounts by type',
      subtitle: '',
      displayType: 'CHART',
      chartType: '',
      data: []
    }
  ];


  ngOnInit() {
    this.logger.DEBUG(this.CONTEXT, 'page.loaded');

    // checks if user is logged in
    if (!this.userService.isUserLoggedIn()) {
      return;
    }
  }


  ngAfterViewInit() {
    // LOAD CHARTS HERE


    const ctx = document.getElementById('myChart');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['ESE', 'SE', 'DL'],
            datasets: [{
                label: 'Backup accounts',
                data: [162, 283, 193],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',

                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
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



 }

}
