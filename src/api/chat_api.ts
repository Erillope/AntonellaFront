import { API_URL } from "./config";
import { AbsctractApi } from "./abstract_api";
import axios from "axios";
import { addDomainToUrl, fromTimeStamp } from "./utils";

const chatApiUrl = API_URL + "chat/";

export interface UserChatInfo {
    userId: string;
    userName: string;
    userProfilePicture: string;
}

export interface ChatMessage {
    id?: string;
    senderId: string;
    content: string;
    timestamp?: Date;
    type: string;
}

export interface SendMessageRequest {
    userId: string;
    content: string;
    type: string;
}

export class ChatApi extends AbsctractApi {

    async getUserChats(): Promise<UserChatInfo[] | undefined> {
        try {
            const response = await axios.get(chatApiUrl+"from_admin/");
            return response.data.data.map((chat: any) => this.mapUserChatInfoRequest(chat));
        } catch (error) {
            this.catchError(error);
        }
    }

    async getChatMessages(userId: string): Promise<any[] | undefined> {
        try {
            const response = await axios.get(chatApiUrl, {params: { user_id: userId }});
            return response.data.data.map((message: any) => this.mapMessage(message));
        } catch (error) {
            this.catchError(error);
        }
    }

    async sendMessage(message: SendMessageRequest): Promise<ChatMessage | undefined> {
        try {
            const request = this.mapSendMessageRequest(message);
            const response = await axios.post(chatApiUrl+"from_admin/", request);
            return this.mapMessage(response.data.data);
        } catch (error) {
            this.catchError(error);
        }
    }

    private mapUserChatInfoRequest(data: any): UserChatInfo {
        return {
            userId: data.user_id,
            userName: data.user_name,
            userProfilePicture: addDomainToUrl(data.user_photo)
        };
    }

    private mapMessage(data: any): ChatMessage {
        return {
            id: data.id,
            senderId: data.sender_id,
            content: data.message_type === 'TEXT' ? data.content : addDomainToUrl(data.content),
            timestamp: fromTimeStamp(data.timestamp),
            type: data.message_type
        };
    }

    private mapSendMessageRequest(message: SendMessageRequest): any {
        return {
            user_id: message.userId,
            content: message.content,
            message_type: message.type,
        };
    }
}
