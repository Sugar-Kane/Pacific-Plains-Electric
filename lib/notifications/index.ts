export interface NotificationResult {
  delivered: boolean;
  providerId?: string;
  reason?: string;
}
export interface NotificationProvider {
  sendTransactional(input: {
    recipient: string;
    template: string;
    recordId: string;
  }): Promise<NotificationResult>;
}
export class UnavailableNotificationProvider implements NotificationProvider {
  async sendTransactional(): Promise<NotificationResult> {
    return { delivered: false, reason: "Notification provider not configured" };
  }
}
