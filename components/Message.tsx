import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../config/firebase";
import { IMessage } from "../type"

const StyledMessage = styled.p`
    width: fit-content;
    word-break: break-all;
    max-width: 90%;
    min-width: 30%;
    padding: 20px 15px;
    border-radius: 8px;
    margin: 10px;
    position: relative;
`

const StyledSentMessage = styled(StyledMessage)`
    margin-left: auto;
    background-color:#dcf8c6;
`

const StyledReceiverMessage = styled(StyledMessage)`
    background-color:whitesmoke;
`

const StyledTimestamp = styled.span`
    color: gray;
    position: absolute;
    bottom: 7px;
    right: 5px;
    text-align: right;
    font-size: 10px; 
`

const Message = ({message}: {message:IMessage}) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth);

    const MessageType = loggedInUser?.email === message.user ?  StyledSentMessage : StyledReceiverMessage;

  return (
    <MessageType>
        {message.text}
        <StyledTimestamp>
            {message.send_at}
        </StyledTimestamp>
    </MessageType>
  )
}

export default Message