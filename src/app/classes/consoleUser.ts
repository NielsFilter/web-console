export class ConsoleUser {
  username: string;
  encryptedCredentials: string;
  platformAddress: string;
  rootBackupGroupId: number;
  rootBackupGroupName: string;
  userInformation: any;

  constructor(username: string,
              encryptedCredentials: string,
              platformAddress: string,
              rootBackupGroupId: number,
              rootBackupGroupName: string,
              userInformation: any) {

    this.username = username;
    this.encryptedCredentials = encryptedCredentials;
    this.platformAddress = platformAddress;
    this.rootBackupGroupId = rootBackupGroupId;
    this.userInformation = userInformation;
    this.rootBackupGroupName = rootBackupGroupName;
  }

}
