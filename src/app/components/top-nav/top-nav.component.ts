import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
  loggedIn: Boolean;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loggedIn = this.dataService.loggedIn;
  }

}
