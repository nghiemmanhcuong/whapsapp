import {Avatar,} from '@mui/material';
import styled from 'styled-components';
import {userRecipient} from '../hooks/userRecipient';

type Props = ReturnType<typeof userRecipient>;

const StyledText = styled.span`
    font-size: 16px;
`

const StyledAvatar = styled(Avatar)`
    margin: 5px 10px 5px 5px;
`

const RecipentAvatar = ({recipient, recipientEmail}: Props) => {
    return recipient?.avatar ? (
        <StyledAvatar sx={{ width: 35, height: 35 }} src={recipient.avatar} />
    ) : (
        <StyledAvatar sx={{ width: 35, height: 35 }}>
            <StyledText>{recipientEmail && recipientEmail[0].toUpperCase()}</StyledText>
        </StyledAvatar>
    );
};

export default RecipentAvatar;
