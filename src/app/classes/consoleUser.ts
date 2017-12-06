export class ConsoleUser {
  username: string;
  encryptedCredentials: string;
  platformAddress: string;
  rootBackupGroupId: number;
  userInformation: any;

  constructor(username: string, encryptedCredentials: string, platformAddress: string, rootBackupGroupId: number, userInformation: any) {
    this.username = username;
    this.encryptedCredentials = encryptedCredentials;
    this.platformAddress = platformAddress;
    this.rootBackupGroupId = rootBackupGroupId;
    this.userInformation = userInformation;
  }

}
