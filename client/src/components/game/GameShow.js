import React, { useState, useEffect } from "react";
import Chat from "../Chat";
import PlayerTile from "./PlayerTile";
import InfoBoard from "./InfoBoard";


const GameShow = ({ user, socket, ...rest}) => {

    const [players, setPlayers] = useState([])
    const [whosTurn, setWhosTurn] = useState(null)
    const [dealtCards, setDealtCards] = useState([])
    const [playedCard, setPlayedCard] = useState({
        playerId: null,
        playedCardId: null
    })
    // const [trumpSuit, setTrumpSuit] = useState({})
    const [leadSuit, setLeadSuit] = useState({})
    const [gameInfo, setGameInfo] = useState({})
    const [round, setRound] = useState([])
    const [gameStart, setGameStart] = useState(false)
    const [messages, setMessages] = useState([])

    const { gameId } = rest.computedMatch.params
    console.log("Game User", user)

    const handleStart = () => {
        console.log("handleStart started")
        socket.emit("game:start", {gameId, players})
        // setGameStart(true)
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

        socket.on('card: played', (card) => {
            setPlayedCard(card)
        })

        socket.on('game:start success', (gamePackage) => {
            console.log("game:start success", gamePackage)
            setDealtCards(gamePackage.deck)
            setRound(gamePackage.round)
            setGameInfo(gamePackage.gameInfo)
            setGameStart(true)
            setWhosTurn()
        })

        
    },[])
    console.log("dealtCards:", dealtCards)

    useEffect(() => {
        return () => {socket.disconnect()}
    }, [gameId])

    useEffect((playedCard) => {
        
    }, [playedCard])


    const sendMessage = (newMessage) => {
        socket.emit("chat message", newMessage)
    }

    let playerTiles = []
    let trumpCard
    if (dealtCards.length > 0) {
        trumpCard = dealtCards.find(card => card.trump == true)
    }

    let dealerId
    let firstUp
    if (gameInfo.dealerOrder){
        dealerId = gameInfo.dealerOrder[round.id - 1]
        nextUp(dealerId)
    }

    const nextUp = (playerId) => {
        nextPlayerId = gameInfo.dealerOrder[playerId + 1]
        setWhosTurn
    }

    // const dealerId = 1

    const playCard = (card) => {
        setPlayedCard(card)
        socket.emit("card:played", (gameInfo.id, user.id, card))
        //MAY WANT TO NOT SET ANY STATE - JUST BROADCAST AND ALLOW BACKEND TO SET STATE BY REPLYING TO ALL
    }


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
                    player={players[i]}
                    dealtCards={tileDealtCards}
                    playCard={playCard}
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
    if (!gameStart && gameInfo.ownerId == user.id) {
        startButtton = (<button type="button" className="button" onClick={handleStart}>Start Game</button>)
    }
    console.log(gameStart)

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
