import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TextInputComponent } from '../../components/text-input/text-input.component';
import { PasswordInputComponent } from '../../components/password-input/password-input.component';
import { Button1Component } from '../../components/button-1/button-1.component';
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

  constructor(private router: Router, private http: HttpClient, private dataService: DataService) { }

  ngOnInit() {

  }

  doLogin(): void {

    this.router.navigate(['/dashboard']);

    // this.dataService.login(this.username, this.password, this.platformAddress)
    // .then(result => {
    //   this.router.navigate(['/dashboard']);
    // })
    // .catch(ex => {
    //   console.log(ex);
    // });
  }

  doSomething(event: any): void {
    console.log('Event triggered!');
      console.log(event);
  }
}
