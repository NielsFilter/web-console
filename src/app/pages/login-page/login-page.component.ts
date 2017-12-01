import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TextInputComponent } from '../../components/text-input/text-input.component';
import { PasswordInputComponent } from '../../components/password-input/password-input.component';
import { Button1Component } from '../../components/button-1/button-1.component';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Http, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements OnInit {
  platformAddress: TextInputComponent;
  username: TextInputComponent;
  password: PasswordInputComponent;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
  }

  doLogin(username: string, password: string, platformAddress: string): void {
    const s = '192.168.21.3';

    // TODO Cleanup & do real auth

    const credentials = 'Basic ' + btoa(`${username}:${password}`);
    const c2 = 'Basic ' + btoa('admin:password');

     const url = `https://${s}/api/odata`;
    //const url = 'https://httpbin.org/basic-auth/admin/password';
    // const h = {'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='};

    let headers = new HttpHeaders({'Authorization': c2});
    headers.append('Content-Type', 'application/json');



    console.log(`Sending login request to ${url}`);
    console.log(c2);
    console.log(headers);


    this.http.get(url, {headers})
            .toPromise()
            .then( res => {
                console.log('Login Page - Login Successful');
                this.router.navigate(['/dashboard']);
              },
              err => {
                console.log(err.status + ' Something went wrong!');
              });
  }
}
