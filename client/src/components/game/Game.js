import React, { useState, useEffect } from "react";
import Chat from "../Chat";


const Game = ({ user, socket, ...rest}) => {

    return (
        <div className="grid-x game-top">
            <h1 className="cell small-6">Game Started!</h1>
            <div className="cell small-6">
                <Chat
                    user={user}
                    socket={socket}
                />
            </div>
        </div>
    )
}

export default Game
