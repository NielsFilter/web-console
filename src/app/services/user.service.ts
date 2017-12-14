import { Injectable, NgZone } from '@angular/core';
import { ConsoleUser } from '../classes/consoleUser';
import { LoggerService } from './logger.service';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable()
export class UserService {
  CONTEXT = 'User Service';
  currentConsoleUser: ConsoleUser;
  loggedIn: Boolean = false;
  
  constructor(private logger: LoggerService, private ngZone: NgZone, private router: Router) {

   }

   getHttpHeaders(): HttpHeaders{
    return new HttpHeaders({
      'Authorization': this.currentConsoleUser.encryptedCredentials,
      'Content-Type': 'application/json',
    });
   }

   isUserLoggedIn(){
    if (!this.currentConsoleUser || !this.currentConsoleUser === undefined || this.currentConsoleUser === null) {
      this.logger.WARN(this.CONTEXT, 'user.not.logged.in.rerouting');
      this.ngZone.run(() => this.router.navigateByUrl('/login'))      // https://stackoverflow.com/questions/35936535/angular-2-ngoninit-not-called ??
      return false;
    }
    return true;
   }
  
}
