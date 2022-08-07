import {
    AttachFile as AttachFileIcon,
    InsertEmoticon,
    Mic as MicIcon,
    MoreVert as MoreVertIcon,
    Send as SendIcon,
} from '@mui/icons-material';
import {IconButton} from '@mui/material';
import {addDoc, collection, doc, serverTimestamp, setDoc} from 'firebase/firestore';
import {useRouter} from 'next/router';
import React, {useRef, useState} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollection} from 'react-firebase-hooks/firestore';
import styled from 'styled-components';
import {auth, db} from '../config/firebase';
import {userRecipient} from '../hooks/userRecipient';
import {Converstion, IMessage} from '../type';
import {
    convertFirestoreTimestampToString,
    generateQueryGetMessages,
    transformMessage,
} from '../utils/getMessagesInConversation';
import Message from './Message';
import RecipentAvatar from './RecipentAvatar';

interface Props {
    conversation: Converstion;
    messages: IMessage[];
}

const StyledRecipientHead = styled.div`
    position: sticky;
    background-color: #fff;
    z-index: 100;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const StyledHeadInfo = styled.div`
    flex-grow: 1;
    > h3 {
        margin-top: 0;
        margin-bottom: 3px;
    }

    > span {
        font-size: 13px;
        color: gray;
    }
`;

const StyedH3 = styled.h3`
    word-break: break-all;
    font-size: 16px;
`;

const StyledHeadIcons = styled.div`
    display: flex;
`;

const StyledMessageContainer = styled.div`
    background-color: #e5ded8;
    padding: 2px;
    min-height: 90vh;
`;

const StyledInputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: #fff;
    z-index: 100;
`;

const StyledInput = styled.input`
    flex-grow: 1;
    outline: none;
    border: none;
    background-color: whitesmoke;
    padding: 15px;
    margin-right: 15px;
    margin-left: 15px;
    border-radius: 35px;
`;

const EndOfMessagesForAutoScroll = styled.div`
    margin-bottom: 20px;
`;

const ConversationScreen = ({conversation, messages}: Props) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const [newMessage, setNewMessage] = useState<string>('');
    const [loggedInUser, _loading, _error] = useAuthState(auth);
    const conversationUser = conversation.users;
    const {recipientEmail, recipient} = userRecipient(conversationUser);

    const router = useRouter();
    const conversationId = router.query.id;
    const queryGetMessages = generateQueryGetMessages(conversationId as string);
    const [messagesSnapShot, messageLoading, __error] = useCollection(queryGetMessages);

    // show all messages
    const showMessages = () => {
        if (messageLoading) {
            return messages.map((message, index) => <Message key={index} message={message} />);
        }

        if (messagesSnapShot) {
            return messagesSnapShot.docs.map((message, index) => (
                <Message key={index} message={transformMessage(message)} />
            ));
        }
    };

    // update last seen user
    const addMessageToDbAndUpdateLastSeen = async () => {
        await setDoc(
            doc(db, 'users', loggedInUser?.uid as string),
            {
                lastSeen: serverTimestamp(),
            },
            {merge: true},
        );

        // add new message to database
        await addDoc(collection(db, 'message'), {
            conversation_id: conversationId,
            text: newMessage,
            send_at: serverTimestamp(),
            user: loggedInUser?.email,
        });

        // resset input field;
        setNewMessage('');
        // scroll to bottom
        scrollToBottom();
    };

    // handle end message
    const sendMessageEnter: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key == 'Enter') {
            e.preventDefault();
            if (!newMessage) return;
            addMessageToDbAndUpdateLastSeen();
        }
    };

    // handle scroll to bottom
    const scrollToBottom = () => {
        endOfMessagesRef?.current?.scrollIntoView({behavior: 'smooth'});
    };

    return (
        <>
            <StyledRecipientHead>
                <RecipentAvatar recipient={recipient} recipientEmail={recipientEmail} />
                <StyledHeadInfo>
                    <StyedH3>{recipientEmail}</StyedH3>
                    {recipient && (
                        <span>
                            Đăng nhập lần cuối:
                            {convertFirestoreTimestampToString(recipient.lastSeen)}
                        </span>
                    )}
                </StyledHeadInfo>
                <StyledHeadIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </StyledHeadIcons>
            </StyledRecipientHead>
            <StyledMessageContainer>
                {showMessages()}
                <EndOfMessagesForAutoScroll ref={endOfMessagesRef} />
            </StyledMessageContainer>
            <StyledInputContainer>
                <InsertEmoticon />
                <StyledInput
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={sendMessageEnter}
                />
                <IconButton onClick={addMessageToDbAndUpdateLastSeen}>
                    <SendIcon />
                </IconButton>
                <IconButton>
                    <MicIcon />
                </IconButton>
            </StyledInputContainer>
        </>
    );
};

export default ConversationScreen;
