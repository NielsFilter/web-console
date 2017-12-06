export class ConsoleUser {
  username: string;
  encryptedCredentials: string;
  platformAddress: string;
  rootBackupGroupId: number;


  constructor(username: string, encryptedCredentials: string, platformAddress: string, rootBackupGroupId: number) {
    this.username = username;
    this.encryptedCredentials = encryptedCredentials;
    this.platformAddress = platformAddress;
    this.rootBackupGroupId = rootBackupGroupId;
  }

}
