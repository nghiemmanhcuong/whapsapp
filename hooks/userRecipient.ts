import {collection, query, where} from 'firebase/firestore';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollection} from 'react-firebase-hooks/firestore';
import {auth, db} from '../config/firebase';
import {AppUser, Converstion} from '../type';
import getRecipientEmail from '../utils/getRecipientEmail';

export const userRecipient = (conversationUser: Converstion['users']) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth);
    const recipientEmail = getRecipientEmail(conversationUser, loggedInUser);

    // get recipient avatar
    const queryGetRecipient = query(collection(db, 'users'), where('email', '==', recipientEmail));
    const [recipientSnapShot, __loading, __error] = useCollection(queryGetRecipient);

    // recipientSnapShot.docs could be an empty , leading to docs[0] being undefined
    // So we have to force "?" after docs[0] because there is no data() on "undefined"
    const recipient = recipientSnapShot?.docs[0]?.data() as AppUser | undefined;

    return {
        recipientEmail,
        recipient,
    };
};
