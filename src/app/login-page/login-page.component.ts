import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TextInputComponent } from '../text-input/text-input.component';
import { PasswordInputComponent } from '../password-input/password-input.component';
import { Button1Component } from '../button-1/button-1.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements OnInit {
  platformAddress: TextInputComponent;
  username: TextInputComponent;
  password: PasswordInputComponent;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  doLogin(username: string, password: string, platformAddress: string): void {
    console.log('Button Pressed');
    console.log('Herro username ' + username + ' from ' + platformAddress);

    // TODO : LOGIN TO SERVER

    this.router.navigate(['/dashboard']);
  }
}