import React, { useState, useEffect } from "react";
import Chat from "../Chat";
import PlayerTile from "./PlayerTile";
import InfoBoard from "./InfoBoard";


const GameShow = ({ user, socket, ...rest}) => {

    const [players, setPlayers] = useState([])
    const [dealtCards, setDealtCards] = useState([])
    const [playedCards, setPlayedCards] = useState([])
    const [whosTurn, setWhosTurn] = useState(null)
    const [gameInfo, setGameInfo] = useState({})
    const [gameStarted, setGameStarted] = useState(false)
    const [trickOver, setTrickOver] = useState({
        isOver: false,
        winnerId: null
    })
    const [trick, setTrick] = useState({})
    const [leadSuit, setLeadSuit] = useState({})
    const [roundOver, setRoundOver] = useState(false)
    const [round, setRound] = useState([])
    const [messages, setMessages] = useState([])
    const [dealerId, setDealerId] = useState(null)

    const { gameId } = rest.computedMatch.params
    console.log("Game User", user)

    const handleStart = () => {
        console.log("handleStart started")
        socket.emit("game:start", {gameId, players})
        // setGameStarted(true)
    }

    console.log("players", players)
    console.log("gameInfo", gameInfo)

    useEffect(() => {

        socket.on('chat message', (message) => {
            setMessages((messages) => [message, ...messages]);
        });

        socket.on("player:joined", (gameStatus) => {
            setPlayers(gameStatus.players)
        })

        socket.emit('chat message', `${user.username} has joined the game`)

        socket.emit('game:joined', { gameId, user })

        socket.on('game:joined success', (gameStatus) => {
            setGameInfo(gameStatus.game)
            setPlayers(gameStatus.players)
        })

        
        socket.on('game:start success', (gamePackage) => {
            console.log("game:start success", gamePackage)
            setDealtCards(gamePackage.deck)
            setRound(gamePackage.round)
            setGameInfo(gamePackage.gameInfo)
            setGameStarted(true)
            setWhosTurn(gamePackage.gameInfo.dealerOrder[1])
            setTrick(gamePackage.trick)
            setDealerId(gamePackage.gameInfo.dealerOrder[1])
        })
        
        socket.on('card: played', (card) => {
            console.log("card: played", card)
        })
        
        socket.on('card:played trickAndRoundOver', (playCardReponse) => {
            console.log('card:played trickAndRoundOver')
            setPlayedCards(playCardReponse.playedCards)
            setTrickOver({
                isOver: playCardReponse.trickOver,
                winnerId: playCardReponse.winnerId
            })
            setWhosTurn(playCardReponse.winnerId)
        // playCardReponse = {
        //     trickOver: true,
        //     roundOver: false,
        //     winnerId: userId,
        //     playedCards: [playedCards]
        //     whosTurn: userId
        //     newTrick: newTrick
        // }

        })

        socket.on('card:played trickOver', (playCardReponse) => {
            console.log('card:played trickOver')
            setPlayedCards(playCardReponse.playedCards)
            setTrickOver({
                isOver: gamePackage.trickOver,
                winnerId: gamePackage.winnerId
            })
        // playCardReponse = {
        //     trickOver: true,
        //     roundOver: false,
        //     winnerId: userId,
        //     playedCards: [playedCards]
        //     whosTurn: userId
        //     newTrick: newTrick
        // }
        })

        socket.on('card:played nextUp', (playCardReponse) => {
            console.log('card:played nextUp', playCardReponse)
            setPlayedCards(playCardReponse.playedCards)
            setWhosTurn(playCardReponse.whosTurn)
        // playCardReponse = {
        //     trickOver: false,
        //     roundOver: false,
        //     playedCards: [playedCards]
        //     whosTurn: userId
        // }
        })

        socket.on("trick:next proceed", () => {
            setPlayedCards([])
            setTrickOver({
                isOver: false,
                winnerId: null
            })
        })

    },[])
    console.log("dealtCards:", dealtCards)

    useEffect(() => {
        return () => {socket.disconnect()}
    }, [gameId])

    const startNextTrick = () => {
        socket.emit("trick:next", (gameInfo.id))
    }

    // useEffect((playedCard) => {
        
    // }, [playedCard])


    const sendMessage = (newMessage) => {
        socket.emit("chat message", newMessage)
    }

    let trumpCard
    if (dealtCards.length > 0) {
        trumpCard = dealtCards.find(card => card.trump == true)
    }

    const nextUp = (dealerId) => {
        
    }

    const playCard = (card) => {
        // setPlayedCard(card)
        console.log("in playCard", gameInfo, round, trick, card)
        socket.emit("card:played", gameInfo, round, trick, card)
        //MAY WANT TO NOT SET ANY STATE - JUST BROADCAST AND ALLOW BACKEND TO SET STATE BY REPLYING TO ALL
    }

    let playerTiles = []
    if (gameInfo) {
        console.log("entered playerTileBuilder")
        for (let i = 0; i < gameInfo.numberOfPlayers; i++) {
            let tileDealtCards = []
            if (dealtCards && players[i]) {
                tileDealtCards = dealtCards.filter(card => card.userId == players[i].id)
                console.log("found players card")
            } else {
                tileDealtCards = []
            }

            let tile = (
                <PlayerTile
                    key={i}
                    user={user}
                    player={players[i]}
                    dealtCards={tileDealtCards}
                    playCard={playCard}
                    whosTurn={whosTurn}
                    playedCards={playedCards}
                    leadSuit={leadSuit}
                    trickOver={trickOver}
                    startNextTrick={startNextTrick}
                />
            )
            if (players[i]?.id == user.id) {
                playerTiles.unshift(tile)
            } else {
                playerTiles.push(tile)
            }
        }
    }
    let startButtton
    if (!gameStarted && gameInfo.ownerId == user.id) {
        startButtton = (<button type="button" className="button" onClick={handleStart}>Start Game</button>)
    }
    console.log(gameStarted)

    return (
        <div className="grid-x">
            <div className="cell small-9 gameboard">
                <div>{startButtton}</div>
                
                <div className="grid-x grid-margin-x grid-container player-tiles">
                    {playerTiles}
                </div>
            </div>
            <div className="cell small-3">
                <div className="grid-y game-sideboard">
                    <InfoBoard 
                        trump={trumpCard}
                        players={players}
                        round={round}
                        dealerId={dealerId}
                        gameInfo={gameInfo}
                    />
                    <div className="cell auto chatbox">
                        <Chat
                            user={user}
                            messages={messages}
                            sendMessage={sendMessage}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameShow
