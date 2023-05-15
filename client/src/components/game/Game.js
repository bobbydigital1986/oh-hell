import React from "react";
import Chat from "../Chat";

const Game = (props) => {

    return (
        <div className="grid-x game-top">
            <h1 className="cell small-6">Game Started!</h1>
            <div className="cell small-6">
                <Chat user={props.user}/>
            </div>
        </div>
    )
}

export default Game