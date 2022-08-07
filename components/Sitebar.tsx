import {
    Tooltip,
    Box,
    Avatar,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVerticalIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import styled from 'styled-components';
import {signOut} from 'firebase/auth';
import {auth, db} from '../config/firebase';
import {useState} from 'react';
import * as EmailValidator from 'email-validator';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollection} from 'react-firebase-hooks/firestore';
import {addDoc, collection, query, where} from 'firebase/firestore';
import { Converstion } from '../type';
import ConverstionSelect from './ConverstionSelect';

const StyledContainer = styled.div`
    height: 100vh;
    min-width: 330px;
    max-width: 350px;
    border-right: 1px solid whitesmoke;
    overflow-y: scroll;

    -ms-overflow-style: none;
    scrollbar-width: none;
    ::-webkit-scrollbar {
        display: none;
    }
`;

const StyledHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    height: 80px;
    background-color: #fff;
    top: 0;
    z-index: 1;
    border-bottom: 1px solid whitesmoke;
    padding: 15px;
`;

const StyledSearch = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 2px;
`;

const StyledInput = styled.input`
    border: none;
    outline: none;
    flex: 1;
`;

const StyledSitebarButton = styled(Button)`
    width: 100%;
    border: 1px solid whitesmoke;
    font-weight: 600;
`;

const StyledUserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;

const Sitebar = () => {
    const [loggedInUser, loading, error] = useAuthState(auth);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [recipientEmail, setRecipientEmail] = useState<string>('');

    // logout current user
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log('ERROR LOGING OUT', error);
        }
    };

    // close dialog add new conversation
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setRecipientEmail('');
    };

    // check if converstion already exists between current logged user and the invited
    const queryGetConversationsForCurrentUser = query(
        collection(db, 'conversations'),
        where('users', 'array-contains', loggedInUser?.email),
    );
    const [conversationsSnapshot, __loading, __error] = useCollection(
        queryGetConversationsForCurrentUser,
    );

    const isConversationAlreadyExists = (recipientEmail: string) =>
        conversationsSnapshot?.docs.find((conversation) =>
            conversation.data().users.includes(recipientEmail),
        );

    // create new conversation
    const createConverstion = async () => {
        if (!recipientEmail) return;
        if (
            EmailValidator.validate(recipientEmail) &&
            recipientEmail !== loggedInUser?.email &&
            !isConversationAlreadyExists(recipientEmail)
        ) {
            // add new conversation to database "conversations" collection
            // a conversation is between the currently logged in user and the invited
            await addDoc(collection(db, 'conversations'), {
                users: [loggedInUser?.email, recipientEmail],
            });
        }
        setOpenDialog(false);
        setRecipientEmail('');
    };

    //

    return (
        <StyledContainer>
            <StyledHeader>
                <Tooltip title={loggedInUser?.email as string} placement='right'>
                    <StyledUserAvatar src={loggedInUser?.photoURL || ''} />
                </Tooltip>
                <Box>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVerticalIcon />
                    </IconButton>
                    <IconButton>
                        <Tooltip title='Đăng xuất' placement='right'>
                            <LogoutIcon onClick={handleLogout} />
                        </Tooltip>
                    </IconButton>
                </Box>
            </StyledHeader>
            <StyledSearch>
                <SearchIcon />
                <StyledInput placeholder='Tìm kiếm cuộc trò chuyện' />
            </StyledSearch>
            <StyledSitebarButton onClick={() => setOpenDialog(true)}>
                Cuộc trò chuyện mới
            </StyledSitebarButton>
            {conversationsSnapshot?.docs.map((conversation) => (
                <ConverstionSelect
                    key={conversation.id}
                    id={conversation.id}
                    conversationUser={(conversation.data() as Converstion).users}
                />
            ))}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Tạo cuộc trò chuyện mới</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Vui lòng nhập email người mà bạn muốn tạo cuộc trò chuyện!!!
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin='dense'
                        id='name'
                        label='Email Address'
                        type='email'
                        fullWidth
                        variant='standard'
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Huỷ tạo</Button>
                    <Button disabled={!recipientEmail} onClick={createConverstion}>
                        Tạo cuộc trò chuyện
                    </Button>
                </DialogActions>
            </Dialog>
        </StyledContainer>
    );
};

export default Sitebar;
