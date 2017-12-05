import { Injectable } from '@angular/core';
import { ConsoleUser } from '../classes/consoleUser';


@Injectable()
export class DataService {
  currentConsoleUser: ConsoleUser;
  loggedIn: Boolean = false;

  constructor() { }

}
