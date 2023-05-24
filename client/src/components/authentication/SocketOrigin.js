import React from "react";
import io from 'socket.io-client';
import socketEndpoint from "../../services/getSocketEndpoint"

const endpoint = socketEndpoint()

const SocketOrigin = ({ Component, user, inheritedSocket, ...rest }) => {
    //Will need logic to handle production environment location
    const socket = inheritedSocket ? inheritedSocket : io(endpoint);

    return (
        <Component 
            user={user}
            socket={socket}
            {...rest}
        />
    )
}

export default SocketOrigin
