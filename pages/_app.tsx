import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth, db} from '../config/firebase';
import Login from './login';
import styled from 'styled-components';
import {CircularProgress} from '@mui/material';
import {useEffect} from 'react';
import {doc, serverTimestamp, setDoc} from 'firebase/firestore';

const StyledLoading = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
`;

function MyApp({Component, pageProps}: AppProps) {
    const [loggedInUser, loading, error] = useAuthState(auth);

    useEffect(() => {
        const setUserInDb = async () => {
            try {
                await setDoc(
                    doc(db, 'users', loggedInUser?.uid as string),
                    {
                        email: loggedInUser?.email,
                        avatar: loggedInUser?.photoURL,
                        name: loggedInUser?.displayName,
                        lastSeen: serverTimestamp(),
                    },
                    {merge: true},
                );
            } catch (error) {
                console.log('ERROR:', error);
            }
        };
        if (loggedInUser) {
            setUserInDb();
        }
    }, [loggedInUser]);

    if (loading)
        return (
            <StyledLoading>
                <CircularProgress />
            </StyledLoading>
        );

    if (!loggedInUser) return <Login />;

    return <Component {...pageProps} />;
}

export default MyApp;
