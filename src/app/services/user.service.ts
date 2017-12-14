import { Injectable } from '@angular/core';
import { ConsoleUser } from '../classes/consoleUser';
import { LoggerService } from './logger.service';


@Injectable()
export class UserService {
  CONTEXT = 'User Service';
  currentConsoleUser: ConsoleUser;
  loggedIn: Boolean = false;
  
  constructor(private logger: LoggerService) {
    
   }

}
