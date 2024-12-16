// Ensure you have the correct export statement
export type PcSetting = {
  uuid: string;
  adminEmail: string;
  nickName: string;
  planName: string;
  fileType: string;
  videoLength?: number;
  captureInterval: number;
  fileQuality: number;
  clientNotificationInterval: string;
  lastCapturedTime: string;
  storageUsed: string;
  captureEnabledByAdmin: boolean;
};
