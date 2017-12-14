import { Injectable } from '@angular/core';
import { ConsoleUser } from '../classes/consoleUser';
import { LoggerService } from './logger.service';
import { HttpHeaders } from '@angular/common/http';


@Injectable()
export class UserService {
  CONTEXT = 'User Service';
  currentConsoleUser: ConsoleUser;
  loggedIn: Boolean = false;
  
  constructor(private logger: LoggerService) {

   }

   getHttpHeaders(): HttpHeaders{
    return new HttpHeaders({
      'Authorization': this.currentConsoleUser.encryptedCredentials,
      'Content-Type': 'application/json',
    });
   }
}
