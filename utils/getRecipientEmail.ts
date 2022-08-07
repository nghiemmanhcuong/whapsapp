import {User} from 'firebase/auth';
import {Converstion} from '../type';

const getRecipientEmail = (ConverstionUser: Converstion['users'], loggedInUser?: User | null) => {
    const recipientEmail = ConverstionUser.find((userEmail) => userEmail !== loggedInUser?.email);
    return recipientEmail;
};

export default getRecipientEmail;
