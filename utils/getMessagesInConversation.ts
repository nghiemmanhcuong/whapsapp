import {
    collection,
    DocumentData,
    orderBy,
    query,
    QueryDocumentSnapshot,
    Timestamp,
    where,
} from 'firebase/firestore';
import {db} from '../config/firebase';
import {IMessage} from '../type';

export const generateQueryGetMessages = (conversationId?: string) =>
    query(
        collection(db, 'message'),
        where('conversation_id', '==', conversationId),
        orderBy('send_at', 'asc'),
    );

export const transformMessage = (message: QueryDocumentSnapshot<DocumentData>) =>
    ({
        id: message.id,
        ...message.data(), // spread out conversation_id, text, sent_at, user
        send_at: message.data().send_at
            ? convertFirestoreTimestampToString(message.data().send_at as Timestamp)
            : null,
    } as IMessage);

export const convertFirestoreTimestampToString = (timestamp: Timestamp) =>
    new Date(timestamp.toDate().getTime()).toLocaleString();
