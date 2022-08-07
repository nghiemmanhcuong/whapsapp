import {Timestamp} from 'firebase/firestore';

export interface Converstion {
    users: string[];
}

export interface AppUser {
    email: string;
    displayName: string;
    lastSeen: Timestamp;
    avatar: string;
}

export interface IMessage {
    id: string
	conversation_id: string
	text: string
	send_at: string
	user: string
}
