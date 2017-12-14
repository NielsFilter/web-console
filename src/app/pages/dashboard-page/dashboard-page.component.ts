import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {
  CONTEXT:string = 'Dashboard Page';
  constructor(private logger: LoggerService, private router: Router) { }

  ngOnInit() {
    this.logger.DEBUG(this.CONTEXT, 'page.loaded');
  }

}
