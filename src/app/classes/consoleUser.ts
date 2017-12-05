export class ConsoleUser {
  username: string;
  encryptedCredentials: string;
  platformAddress: string;

  constructor(username: string, encryptedCredentials: string, platformAddress: string){
    this.username = username;
    this.encryptedCredentials = encryptedCredentials;
    this.platformAddress = platformAddress;
  }
}
