import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {
  private TRACE_ENABLED= true;

  // styles for levels
  STYLE_LEVEL_INFO = 'color: blue;';
  STYLE_LEVEL_DEBUG = 'color: green;';
  STYLE_LEVEL_WARN = 'color: orange;';
  STYLE_LEVEL_ERROR = 'color: red; font-weight: bold;';
  STYLE_LEVEL_TRACE = 'color: plum; font-style: italic;';

  // logging levels
  TITLE_INFO = 'INFO';
  TITLE_DEBUG = 'DEBUG';
  TITLE_WARN = 'WARN';
  TITLE_ERROR = 'ERROR';
  TITLE_TRACE = 'TRACE';

  // string resources
  loggerStringResources = {
    // test
    'test.params': 'This is a test message with parameter {0} and {1}',
    'test': 'this is a test message',


    // general
    'user.not.logged.in.rerouting': 'User not logged in, re-routing to login page',
    'page.loaded': 'loaded',


    // login page
    'login.page.empty.fields': 'Not all required fields were present',
    'login.successful': 'Login Successful, logging is as {0}',
    'login.unsuccessful': 'Login failed with status code {0}',


    // dashboard page


    // backup management page
    'retrieve.group.details.successful': 'Retrieving details for group with id "{0}" successful',
    'retrieve.group.details.unsuccessful': 'Retrieving details for group with id "{0}" failed',
    'retrieve.accounts.for.group.successful': 'Retrieving accounts under group {0} successful',
    'retrieve.accounts.for.group.unsuccessful': ' Retrieving accounts under group {0} failed',
    'retrieve.account.details.successful': 'Retrieving details for account {0} successful',
    'retrieve.account.details.unsuccessful': 'Retrieving details for account {0} failed',
    'search.for.item.skipped': 'search will be skipped for current item',
    'search.for.item.successful': 'Searching for item successful',
    'search.for.item.unsuccessful': 'Searching for item failed',


    // backup account details component
    'retrieve.backup.history.successful': 'Retrieving backup history for account with id {0} successful',
    'retrieve.backup.history.unsuccessful': 'Retrieving backup history for account with id {0} failed',


    // data service
    'data.service.sending.login.request': 'Sending login request to "{0}"',
    'retrieve.group.children.details': 'Retrieving details for group with id "{0}"',
    'retrieve.accounts.for.group': 'Retrieving accounts for group with id "{0}"',
    'retrieve.account.details': 'Retrieving details for account "{0}"',
    'search.for.accounts': 'Searching for accounts that contain "{0}"',
    'retrieve.backup.history': 'Retrieving {0} backup history records for account {1}'

  };

  constructor() { }

  INFO(context: string, messageKey: string, messageParameters: string[] = []) {
    const messageText = this.getStringResource(messageKey, messageParameters);
    const builtMessage = `${context} - ${messageText}`;

    this.printMessage(this.TITLE_INFO,
                      builtMessage,
                      this.STYLE_LEVEL_INFO);
  }

  DEBUG(context: string, messageKey: string, messageParameters: string[] = []) {
    const messageText = this.getStringResource(messageKey, messageParameters);
    const builtMessage = `${context} - ${messageText}`;

    this.printMessage(this.TITLE_DEBUG,
                      builtMessage,
                      this.STYLE_LEVEL_DEBUG);
  }

  WARN(context: string, messageKey: string, messageParameters: string[] = []) {
    const messageText = this.getStringResource(messageKey, messageParameters);
    const builtMessage = `${context} - ${messageText}`;

    this.printMessage(this.TITLE_WARN,
                      builtMessage,
                      this.STYLE_LEVEL_WARN);
  }

  ERROR(context: string, messageKey: string, messageParameters: string[] = []) {
    const messageText = this.getStringResource(messageKey, messageParameters);
    const builtMessage = `${context} - ${messageText}`;

    this.printMessage(this.TITLE_ERROR,
                      builtMessage,
                      this.STYLE_LEVEL_ERROR);
  }

  TRACE(context: string, messageKey: string, messageParameters: string[] = []) {
    const messageText = this.getStringResource(messageKey, messageParameters);
    const builtMessage = `${context} - ${messageText}`;

    // only print if trace is enabled
    if (this.TRACE_ENABLED) {
    this.printMessage(this.TITLE_TRACE,
                      builtMessage,
                      this.STYLE_LEVEL_TRACE);
    }
  }

  // print the message
  private printMessage(title: string, message: string, style: string) {
    // tslint:disable-next-line:quotemark
    console.log("%c" + `${this.getCurrentTime()} ${title} ${message}`, style);
  }

  // gets the current time of the logged message
  private getCurrentTime(): string {
    const utcTime = new Date() ;
    // utcTime.toUTCString();
    // utcTime.toJSON();
    return utcTime.toLocaleTimeString();
  }


  private getStringResource(messageKey: string, messageParameters: string[]): string {
    // If the key is not present, return the key
    if (this.loggerStringResources[messageKey] === undefined ||
        this.loggerStringResources[messageKey] === null ||
        this.loggerStringResources[messageKey] === '') {
      return messageKey;
    }

    // If the key is present and there are no parameters
    if (messageParameters.length === 0) {
      return this.loggerStringResources[messageKey];
    } else {
      // If the key is present and there are parameters
      let count = 0;
      const message = this.loggerStringResources[messageKey];
      let temp = message;
      for (const param of messageParameters) {
        const p = `{${count}}`;
        temp = temp.replace(p, param);
        count++;
      }
      return temp;
    }
  }
}
