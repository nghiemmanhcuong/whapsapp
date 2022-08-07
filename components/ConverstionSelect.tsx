import {Box} from '@mui/material';
import {useRouter} from 'next/router';
import styled from 'styled-components';
import {userRecipient} from '../hooks/userRecipient';
import {Converstion} from '../type';
import RecipentAvatar from './RecipentAvatar';

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    cursor: pointer;
    word-break: break-all;
    :hover {
        background-color: #e9eaeb;
    }
`;

const ConverstionSelect = ({
    id,
    conversationUser,
}: {
    id: string;
    conversationUser: Converstion['users'];
}) => {
    const {recipient, recipientEmail} = userRecipient(conversationUser);
    const router = useRouter();

    const handleConversationSelect = () => {
        router.push(`/conversation/${id}`);
    };

    return (
        <StyledContainer onClick={handleConversationSelect}>
            <RecipentAvatar recipient={recipient} recipientEmail={recipientEmail} />
            <Box component='span'>{recipientEmail}</Box>
        </StyledContainer>
    );
};

export default ConverstionSelect;
