import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from '../../services/logger.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {
  CONTEXT:string = 'Dashboard Page';
  constructor(private logger: LoggerService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.logger.DEBUG(this.CONTEXT, 'page.loaded');

    // checks if user is logged in
    if(!this.userService.isUserLoggedIn()){
      return;
  }
  }

}
