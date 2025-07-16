import { Avatar, Box, IconButton, TextField, Typography } from "@mui/material"
import { useChat } from "../hooks/useChat"
import { UserChatInfo } from "../api/chat_api";
import "../styles/userCard.css";
import { useState } from "react";
import SendIcon from '@mui/icons-material/Send';

export const Chats = () => {
    const chatController = useChat();

    return (
        <Box display={'flex'} flexDirection='row' height='100%' width={'100%'} gap={10}>
            <UserChatCardBox userInfos={chatController.users} onSelectChat={chatController.selectChat}
                selectedUser={chatController.selectedUser} />
            <Box display={'flex'} flexDirection={'column'} width={'50%'} border={1} borderRadius={5} height={'90%'} bgcolor={'#f3f3f3'} padding={2} overflow='auto' gap={3} flexGrow={1}>
                <Box
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        paddingRight: 1,
                    }}
                >
                    {[...chatController.messages].reverse().map((message) => (
                    <ChatBubble key={message.id} message={message.content} mine={message.senderId != chatController.selectedUser?.userId} type={message.type} userPhoto={message.senderId === chatController.selectedUser?.userId ? chatController.selectedUser?.userProfilePicture : ""} />
                ))}
                <div ref={chatController.messagesEndRef} />
                </Box>
                
                {chatController.messages.length > 0 && <MessageInputBar onSend={chatController.sendMessage} />}
            </Box>
        </Box>
    )
}

const UserChatCardBox = (props: { userInfos: UserChatInfo[], onSelectChat: (user: UserChatInfo) => void, selectedUser: UserChatInfo }) => {
    return <Box display={'flex'} flexDirection='column' width={'30%'} flexWrap='wrap' height={'100%'} alignItems='center'>
        {props.userInfos.map((user) => (
            <UserChatCard key={user.userId} userInfo={user} onSelectChat={() => props.onSelectChat(user)} selected={user.userId === props.selectedUser.userId} />
        ))}
    </Box>
}

const UserChatCard = (props: { userInfo: UserChatInfo, onSelectChat: () => void, selected: boolean }) => {
    return (
        <Box className={props.selected ? 'selectedUserCard' : 'userCard'} onClick={props.onSelectChat}>
            <Avatar src={props.userInfo.userProfilePicture} alt={props.userInfo.userName} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
            <Box marginLeft='8px'>
                <p style={{ fontWeight: 'bold' }}>{props.userInfo.userName}</p>
            </Box>
        </Box>
    )
}

const ChatBubble = (props: { message: string, mine: boolean, type: string, userPhoto?: string }) => {
    return (
        <Box
            sx={{
                backgroundColor: '#fce4ec',
                color: 'black',
                padding: 1.5,
                borderRadius: 2,
                maxWidth: '80%',
                display: 'inline-block',
                alignSelf: props.mine ? 'flex-end' : 'flex-start',
            }}
        >
            <Box display={'flex'} flexDirection={'row'}>
                {!props.mine && props.userPhoto && <Avatar src={props.userPhoto} style={{ width: '30px', height: '30px', marginRight: '8px' }} />}
                {props.type === 'TEXT' ? <Typography variant="body1">{props.message}</Typography>
                    : <Avatar src={props.message} style={{ width: '200px', height: '200px' }} variant="square" />}
            </Box>
        </Box>
    );
};

const MessageInputBar = (props: { onSend: (message: string) => void }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim() !== '') {
            props.onSend(message);
            setMessage('');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                padding: 1,
                borderTop: '1px solid #ddd',
                backgroundColor: '#f9f9f9',
            }}
        >
            <TextField
                fullWidth
                placeholder="Escribe un mensaje..."
                variant="outlined"
                size="small"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                }}
                sx={{ mr: 1 }}
            />
            <IconButton
                sx={{ color: "#F44565" }}
                onClick={handleSend}
                disabled={message.trim() === ''}
            >
                <SendIcon />
            </IconButton>
        </Box>
    );
};