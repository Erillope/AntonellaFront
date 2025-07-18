import { AbsctractApi } from "./abstract_api";
import { API_URL } from "./config";
import axios from "axios";
import { capitalizeFirstLetter, fromTimeStamp } from "./utils";

const notificationApiUrl = `${API_URL}notification/`;

export interface Notification {
    id?: string;
    title: string;
    body: string;
    to: string;
    type?: string;
    publishDate?: Date;
    createdDate?: Date;
}

export interface NotificationFilter {
    title?: string;
    type?: string;
    startPublishDate?: Date;
    endPublishDate?: Date;
    limit?: number;
    offset?: number;
    onlyCount?: boolean;
}

export interface NotificationFilterResponse {
    notifications: Notification[];
    totalCount: number;
    filteredCount: number;
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

    async filterNotifications(filter: NotificationFilter): Promise<NotificationFilterResponse> {
        try {
            const request = this.mapFilterRequest(filter);
            const response = await axios.post(notificationApiUrl + "filter/", request);
            return {
                notifications: response.data.data.notifications.map(this.mapNotificationResponse),
                totalCount: response.data.data.count,
                filteredCount: response.data.data.filtered_count
            }
        } catch (error) {
            this.catchError(error);
            return {
                notifications: [],
                totalCount: 0,
                filteredCount: 0
            };
        }
    }

    async getById(id: string): Promise<Notification | undefined> {
        try {
            const response = await axios.get(notificationApiUrl, { params: { id } });
            return this.mapNotificationResponse(response.data.data);
        } catch (error) {
            this.catchError(error);
            return undefined;
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

    private mapFilterRequest(filter: NotificationFilter): any {
        return {
            title: filter.title,
            type: filter.type?.toUpperCase(),
            start_date: filter.startPublishDate ? filter.startPublishDate.toISOString() : undefined,
            end_date: filter.endPublishDate ? filter.endPublishDate.toISOString() : undefined,
            limit: filter.limit,
            offset: filter.offset,
            only_count: filter.onlyCount
        };
    }

    private mapNotificationResponse(response: any): Notification {
        return {
            id: response.id,
            title: response.title,
            body: response.body,
            to: response.to,
            type: capitalizeFirstLetter(response.type),
            publishDate: response.publish_date ? fromTimeStamp(response.publish_date) : undefined,
            createdDate: response.created_date ? fromTimeStamp(response.created_date) : undefined
        };
    }
}