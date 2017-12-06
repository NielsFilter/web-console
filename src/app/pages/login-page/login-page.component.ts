import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Http } from '@angular/http';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { DataService } from '../../services/data.service';
import { ConsoleUser } from '../../classes/consoleUser';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements OnInit {
  username: string;
  password: string;
  platformAddress: string;

  errorOccurred = false;
  errorMessage = 'Oops';

  constructor(private router: Router, private http: HttpClient, private dataService: DataService) { }

  ngOnInit() {

  }

  doLogin(): void {
    this.dataService.login(this.username, this.password, this.platformAddress)
    .then(result => {

    })
    .catch(ex => {
      this.errorOccurred = true;
      this.errorMessage = 'mooooo';
      console.log(ex);
    });
  }

  doSomething(event: any): void {
    console.log('Event triggered!');
      console.log(event);
  }
}
