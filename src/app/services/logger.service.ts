import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {
  STYLE_LEVEL_INFO:string = 'color: blue;';
  STYLE_LEVEL_DEBUG:string = 'color: green;';
  STYLE_LEVEL_WARN:string = 'color: orange;';
  STYLE_LEVEL_ERROR:string = 'color: red; font-weight: bold;';

  TITLE_INFO = 'INFO';
  TITLE_DEBUG = 'DEBUG';
  TITLE_WARN = 'WARN';
  TITLE_ERROR = 'ERROR';

  p1 = '';
  p2 = '';
  p3 = '';

  stringResources = {
    'test.params': 'This is a test message with parameter {0} and {1}',
    'test':'this is a test message',

    'user.not.logged.in.rerouting':'User not logged in, re-routing to login page',
    'page.loaded': 'loaded',
    'login.page.empty.fields': 'Not all required fields were present',
    'data.service.sending.login.request': 'Sending login request to {0}',
    'data.service.login.successful': 'Login Successful, logging is as {0}',
    'data.service.login.unsuccessful': 'Login failed with status code {0}',
    'data.service.fetching.groups': 'Fetching groups from platform', 
    'data.service.fetching.groups.successful': 'Fetching groups successful',
    'data.service.fetching.groups.unsuccessful': 'Fetching groups failed',
    'data.service.ordering.groups':'Ordering groups',
    'data.service.ordering.groups.successful':'Ordering groups successful',
    'data.service.fetching.accounts.for.group':'Fetching accounts for group {0}',

  };

  constructor() { }

  INFO(context: string, messageKey: string, messageParameters:string[] = []){
    const messageText = this.getStringResource(messageKey, messageParameters);
    const builtMessage = `${context} - ${messageText}`;

    this.printMessage(this.TITLE_INFO, 
                      builtMessage, 
                      this.STYLE_LEVEL_INFO);
  }

  DEBUG(context: string, messageKey: string, messageParameters:string[] = []){
    const messageText = this.getStringResource(messageKey, messageParameters);
    const builtMessage = `${context} - ${messageText}`;

    this.printMessage(this.TITLE_DEBUG, 
                      builtMessage, 
                      this.STYLE_LEVEL_DEBUG);
  }

  WARN(context: string, messageKey: string, messageParameters:string[] = []){
    const messageText = this.getStringResource(messageKey, messageParameters);
    const builtMessage = `${context} - ${messageText}`;

    this.printMessage(this.TITLE_WARN, 
                      builtMessage, 
                      this.STYLE_LEVEL_WARN);
  }

  ERROR(context: string, messageKey: string, messageParameters:string[] = []){
    const messageText = this.getStringResource(messageKey, messageParameters);
    const builtMessage = `${context} - ${messageText}`;


    this.printMessage(this.TITLE_ERROR, 
                      builtMessage, 
                      this.STYLE_LEVEL_ERROR);
  }

  private printMessage(title:string, message: string, style: string){
    console.log("%c" + `${this.getCurrentTime()} ${title} ${message}`, style);
  }

  private getCurrentTime():string {
    const utcTime = new Date() ;
    // utcTime.toUTCString();
    // utcTime.toJSON();
    return utcTime.toLocaleTimeString();
  }


  private getStringResource(messageKey: string, messageParameters:string[]): string{
    // If the key is not present, return the key
    if(this.stringResources[messageKey] === undefined || this.stringResources[messageKey] === null || this.stringResources[messageKey] === ''){
      return messageKey;
    }
    //If the key is present and there are no parameters
    if(messageParameters.length === 0){
      return this.stringResources[messageKey];
    }
    //If the key is present and there are parameters
    else{
      let count = 0;
      let message = this.stringResources[messageKey];
      let temp = message;
      for (let param of messageParameters) {
        const p = `{${count}}`;
        temp = temp.replace(p,param);
        count++;
      }
      return temp;
    }
  }
}
