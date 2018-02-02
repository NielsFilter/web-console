import { Component, OnInit } from '@angular/core';

import { DataService } from '../../sp-comms/data.service';
import { LoggerService } from '../../services/logger.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  constructor( private logger: LoggerService, private dataService: DataService, private userService:UserService, private router: Router) { }

  ngOnInit() {
  }

}
