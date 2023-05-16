import React from "react";
import io from 'socket.io-client';


const SocketOrigin = ({ Component, user, inheritedSocket, ...rest }) => {
    //Will need logic to handle production environment location
    const socket = inheritedSocket ? inheritedSocket : io('http://localhost:3000');

    return (
        <Component 
            user={user}
            socket={socket}
            {...rest}
        />
    )
}

export default SocketOrigin
