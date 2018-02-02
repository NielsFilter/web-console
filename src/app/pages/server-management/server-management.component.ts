import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../../logger/logger.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-server-management',
  templateUrl: './server-management.component.html',
  styleUrls: ['./server-management.component.css']
})
export class ServerManagementComponent implements OnInit {
  CONTEXT = 'Server Management Page';
  constructor(private logger: LoggerService, private userService: UserService) { }

  ngOnInit() {
    this.logger.DEBUG(this.CONTEXT, 'page.loaded');

    // checks if user is logged in
    if(!this.userService.isUserLoggedIn()){
    return;
  }
  }

}
