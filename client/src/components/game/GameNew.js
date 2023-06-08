import React, { useEffect, useState } from "react";
import Chat from "../Chat";
import { Redirect } from "react-router-dom";

const GameNew = ({ user, socket, gameSettings, ...props}) => {

    console.log("GameNew gameSettings", props.location.gameSettings)
    const [gameId, setGameId] = useState(null)
    // console.log(gameId)

    console.log(props)
    
    let numberOfPlayers = 4
    let numberOfRounds = 3
    let gameCreate = false
    if (props.location.gameSettings) {
        numberOfPlayers = props.location.gameSettings.numberOfPlayers
        numberOfRounds = props.location.gameSettings .numberOfRounds
        gameCreate = true
    }
    
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('game:create success', (gameId) => {
            // console.log("socket response", gameId)
            setGameId(gameId.newGameId)
        })
        
        socket.on('game:create join-existing', (gameId) => {
            // console.log("socket response", gameId)
            setGameId(gameId.existingGameId)
        })
        
        socket.emit("game:create", user, numberOfPlayers, numberOfRounds, gameCreate)
        //("game:create", user, numberOfPlayers, numberOfRounds)

        return () => {
            socket.removeAllListeners("room:create success")
            socket.removeAllListeners("room:create open-room-exists")
        }
    }, []);

    if (gameId) {
        return (
            <Redirect to={{
                pathname: `/game/${gameId}`,
                socket: socket
                }}
            />
        )
    }

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

export default GameNew