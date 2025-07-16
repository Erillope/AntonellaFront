import { useEffect, useRef, useState } from "react";
import { ChatApi, ChatMessage, SendMessageRequest, UserChatInfo } from "../api/chat_api";

export const useChat = () => {
    const [users, setUsers] = useState<UserChatInfo[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserChatInfo>({ userId: "", userName: "", userProfilePicture: "" });
    const userIdRef = useRef<string>(selectedUser.userId);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [updateScrollFlag, setUpdateScrollFlag] = useState(false);
    const chatApi = new ChatApi();

    useEffect(() => {
        const fetchChats = async () => {
            const userChats = await chatApi.getUserChats();
            if (userChats) {
                setUsers(userChats);
            }
        };
        fetchChats();
    }, [])

    useEffect(() => {
        userIdRef.current = selectedUser.userId;
    }, [selectedUser.userId]);

    useEffect(() => {
        const interval = setInterval(async () => {
            const messages = await chatApi.getChatMessages(userIdRef.current);
            if (messages) {
                setMessages(([...messages]));
            }
        }, 1000)
        return () => clearInterval(interval);
    }, [])

    const updateScroll = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const selectChat = async (user: UserChatInfo) => {
        const messages = await chatApi.getChatMessages(user.userId);
        setSelectedUser(user);
        if (messages) {
            setMessages(messages);
        }
        setUpdateScrollFlag(prev => !prev);
    }

    const sendMessage = async (messageContent: string) => {
        const message: SendMessageRequest = {
            userId: selectedUser.userId,
            content: messageContent,
            type: "TEXT"
        }
        const response = await chatApi.sendMessage(message);
        if (response) {
            setMessages(prevMessages => [response, ...prevMessages]);
        }
        setUpdateScrollFlag(prev => !prev);
    }

    useEffect(updateScroll, [updateScrollFlag]);

    return {
        users,
        selectChat,
        messages,
        selectedUser,
        setSelectedUser,
        sendMessage,
        messagesEndRef
    }
}