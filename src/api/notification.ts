import { AbsctractApi } from "./abstract_api";
import { API_URL } from "./config";
import axios from "axios";

const notificationApiUrl = `${API_URL}notification/`;

export interface Notification {
    title: string;
    body: string;
    to: string;
    type?: string;
    publishDate?: Date;
    createdDate?: Date;
}


export class NotificationApi extends AbsctractApi {
    async sendNotification(notification: Notification): Promise<void> {
        const request = this.mapSendNotificationRequest(notification);
        try {
            await axios.post(notificationApiUrl, request);
        } catch (error) {
            this.catchError(error);
        }
    }

    private mapSendNotificationRequest(notification: Notification): any {
        return {
            title: notification.title,
            body: notification.body,
            to: notification.to,
            type: notification.type?.toUpperCase(),
            publish_date: notification.publishDate ? notification.publishDate.toISOString() : undefined
        };
    }
}