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
    const [leadSuit, setLeadSuit] = useState({})
    const [round, setRound] = useState({})
    const [messages, setMessages] = useState([])
    const [dealerId, setDealerId] = useState(null)
    const [trick, setTrick] = useState({})
    const [betScores, setBetScores] = ([])
    const [gameOver, setGameOver] = useState({
        whatsOver: "", //trick, round, game
        winnerId: null // id of winning user
    })

    const { gameId } = rest.computedMatch.params
    // console.log("Game User", user)

    const handleStart = () => {
        console.log("handleStart started")
        socket.emit("game:start", gameInfo, players)
        // setGameStarted(true)
    }

    // console.log("players", players)
    console.log("GameShow gameInfo", gameInfo)
    console.log("GameShow gameOver", gameOver)
    // console.log("GameShow roundOver", roundOver)
    // console.log("GameShow trickOver", trickOver)
    console.log("GameShow whosTurn", whosTurn)
    console.log("GameShow players", players)
    console.log("GameShow gameStarted", gameStarted)
    console.log("GameShow dealtCards", dealtCards)
    console.log("GameShow playedCards", playedCards)
    
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
            console.log('game:joined success')
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
            setDealerId(gamePackage.round.dealerId)
        })
        
        socket.on('card:played trickAndRoundOver', (playCardReponse) => {
            console.log('card:played trickAndRoundOver')
            setPlayedCards(playCardReponse.playedCards)
            // setTrickOver({
            //     isOver: playCardReponse.trickOver,
            //     winnerId: playCardReponse.winnerId
            // })
            setGameOver({
                whatsOver: "round",
                winnerId: playCardReponse.gameOver.winnerId
            })
            // setRoundOver(true)
            // setDealerId(null)
            setWhosTurn(null)
            // setLeadSuit({})
        // playCardReponse = {
        //     gameOver: {
        //        whatsOver: round,
        //        winnerId: 1
        //     }
        //     playedCards: [playedCards]
        //     whosTurn: userId
        //     newTrick: newTrick
        // }

        })

        socket.on('card:played trickOver', (playCardReponse) => {
            console.log('card:played trickOver')
            setPlayedCards(playCardReponse.playedCards)
            // setTrickOver({
            //     isOver: true,
            //     winnerId: playCardReponse.winnerId
            // })
            setGameOver({
                whatsOver: "trick",
                winnerId: playCardReponse.gameOver.winnerId
            })
            setWhosTurn(null)
            // setLeadSuit({})
        // playCardReponse = {
        //     trickOver: true,
        //     roundOver: false,
        //     winnerId: userId,
        //     playedCards: [playedCards]
        //     whosTurn: userId
        //     newTrick: newTrick
        // }
        })

        socket.on('card:played success', (playCardReponse) => {
            console.log('card:played success', playCardReponse)
            setPlayedCards(playCardReponse.playedCards)
            setWhosTurn(playCardReponse.whosTurn)
            setLeadSuit(playCardReponse.leadSuit)
        // playCardReponse = {
        //     trickOver: false,
        //     roundOver: false,
        //     playedCards: [playedCards]
        //     whosTurn: userId
        //     leadSuit: playedCard
        // }
        })

        socket.on("trick:next success", (newTrickPackage) => {
            console.log("trick:next success")
            setPlayedCards([])
            setTrick(newTrickPackage.newTrick)
            setDealtCards(newTrickPackage.dealtCards)
            // setTrickOver({
            //     isOver: false,
            //     winnerId: null
            // })
            setGameOver({
                whatsOver: "",
                winnerId: null
            })
            setLeadSuit({})
            setWhosTurn(newTrickPackage.lastTrickWinnerId)
        })

        socket.on("round:next success", (roundPackage) => {
            console.log("round:next success", roundPackage)
            // const dealer = roundPackage.dealerOrder[round.numberOfTricks]
            // setTrickOver({
            //     isOver: false,
            //     winnerId: null
            // })
            setGameOver({
                whatsOver: "",
                winnerId: null
            })
            // setRoundOver(false)
            setPlayedCards([])
            setLeadSuit({})
            setDealtCards(roundPackage.deck)
            setTrick(roundPackage.trick)
            setRound(roundPackage.round)
            setDealtCards(roundPackage.deck)
            setWhosTurn(roundPackage.whosTurn)
            setDealerId(roundPackage.round.dealerId)
        })

    },[])

    useEffect(() => {
        return () => {socket.disconnect()}
    }, [gameId])

    // console.log("dealtCards:", dealtCards)

    const betSubmitter = () => {

    }

    if (players?.length >= gameInfo?.numberOfPlayers && gameInfo.acceptingRegistrants && !gameStarted) {
        socket.emit("game: full", gameInfo)
    }

    const nextPhase = () => {
        // console.log("nextPhase roundOver", roundOver)
        console.log("nextPhase gameOver", gameOver)
        if (gameOver.whatsOver == "round") {
            console.log("gameShow caught the roundOver if")
            socket.emit("round:next", gameInfo, round)
        } else {
            console.log("gameShow missed the roundOver if")
            socket.emit("trick:next", (gameInfo.id))
        }
    }

    const sendMessage = (newMessage) => {
        socket.emit("chat message", newMessage)
    }

    let trumpCard
    if (dealtCards?.length > 0) {
        trumpCard = dealtCards.find(card => card.trump == true)
    }

    const playCard = (card) => {
        // setPlayedCard(card)
        // console.log("in playCard => card:played", "gameinfo", gameInfo, "round", round, "trick", trick, "card", card)
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
                // console.log("found players card")
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
                    gameOver={gameOver}
                    nextPhase={nextPhase}
                    betSubmitter={betSubmitter}
                    betScores={betScores}
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
    // console.log(gameStarted)
    

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
                        leadSuit={leadSuit}
                        betScores={betScores}
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
