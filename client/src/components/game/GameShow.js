import React, { useState, useEffect } from "react";
import Chat from "../Chat";
import PlayerTile from "./PlayerTile";
import InfoBoard from "./InfoBoard";
import { Redirect } from "react-router-dom";



const GameShow = ({ user, socket, ...rest}) => {

    const [players, setPlayers] = useState([])
    const [dealtCards, setDealtCards] = useState([])
    const [playedCards, setPlayedCards] = useState([])
    const [whosTurn, setWhosTurn] = useState(null)
    const [gameInfo, setGameInfo] = useState({})
    const [gameStarted, setGameStarted] = useState(false)
    const [leadSuit, setLeadSuit] = useState({
        suit: "",
        suitId: null
    })
    const [round, setRound] = useState({
        id: null,
        gameId: null,
        dealerId: null,
        numberOfTricks: null,
        phase: "",
        whosTurn: null
    })
    const [messages, setMessages] = useState([])
    const [dealerId, setDealerId] = useState(null)
    const [trick, setTrick] = useState({})
    const [betScores, setBetScores] = useState([])
    const [phaseOver, setPhaseOver] = useState({
        whatsOver: "", //trick, round, game
        winnerId: null // id of winning user
    })
    const [shouldRedirect, setShouldRedirect] = useState(false)
    const { gameId } = rest.computedMatch.params

    const handleStart = () => {
        socket.emit("game:start", gameInfo, players)
    }

    // STATE CHECKS
    // console.log("GameShow players", players)
    // console.log("GameShow dealtCards", dealtCards)
    // console.log("GameShow playedCards", playedCards)
    // console.log("GameShow whosTurn", whosTurn)
    // console.log("GameShow gameInfo", gameInfo)
    // console.log("GameShow gameStarted", gameStarted)
    // console.log("GameShow leadSuit", leadSuit)
    // console.log("GameShow round", round)
    // console.log("GameShow messages", messages)
    // console.log("GameShow dealerId", dealerId)
    // console.log("GameShow trick", trick)
    // console.log("GameShow betScores", betScores)
    // console.log("GameShow phaseOver", phaseOver)
    // console.log("GameShow shouldRedirect", shouldRedirect)

    
    useEffect(() => {

        socket.on('chat message', (message) => {
            setMessages((messages) => [message, ...messages]);
        });

        socket.on("player:joined", (gameStatus) => {
            setPlayers(gameStatus.players)
        })

        socket.emit('chat message', `${user.username} has joined the game`, gameId)

        socket.emit('game:joined', { gameId, user })

        socket.on('game:joined success', (gameStatus) => {
            console.log('game:joined success')
            setGameInfo(gameStatus.game)
            setPlayers(gameStatus.players)
        })

        socket.on('game:joined redirect', () => {
            setShouldRedirect(true)
        })

        socket.on('game:joined reconnect', (gameState) => {
            // console.log('player reconnected gameState', gameState)
            setPlayers(gameState.players)
            setDealtCards(gameState.dealtCards)
            setPlayedCards(gameState.playedCards)
            setWhosTurn(gameState.whosTurn)
            setGameInfo(gameState.gameInfo)
            setGameStarted(gameState.gameStarted)
            setLeadSuit(gameState.leadSuit)
            setRound(gameState.round)
            setDealerId(gameState.dealerId)
            setTrick(gameState.trick)
            setBetScores(gameState.betScores)
            setPhaseOver(gameState.phaseOver)
        })

        
        socket.on('game:start success', (gamePackage) => {
            setDealtCards(gamePackage.deck)
            setRound(gamePackage.round)
            setGameInfo(gamePackage.gameInfo)
            setGameStarted(true)
            setWhosTurn(gamePackage.round.whosTurn)
            setTrick(gamePackage.trick)
            setDealerId(gamePackage.round.dealerId)
        })
        
        socket.on('card:played trickAndRoundOver', (playCardResponse) => {
            setPlayedCards(playCardResponse.playedCards)
            setBetScores(playCardResponse.betScores)
            setPlayers(playCardResponse.players)
            setPhaseOver({
                whatsOver: "round",
                winnerId: playCardResponse.phaseOver.winnerId
            })
            setWhosTurn(null)
        })

        socket.on('card:played gameOver', (playCardResponse) => {
            setPhaseOver({
                whatsOver: "game"
            })
            setPlayers(playCardResponse.players)
            setBetScores(playCardResponse.betScores)
        })

        socket.on('card:played trickOver', (playCardResponse) => {
            setPlayedCards(playCardResponse.playedCards)
            setBetScores(playCardResponse.betScores)
            setPhaseOver({
                whatsOver: "trick",
                winnerId: playCardResponse.phaseOver.winnerId
            })
            setWhosTurn(null)

        })

        socket.on('card:played success', (playCardResponse) => {
            setPlayedCards(playCardResponse.playedCards)
            setWhosTurn(playCardResponse.round.whosTurn)
            setLeadSuit(playCardResponse.leadSuit)
        })

        socket.on("trick:next success", (newTrickPackage) => {
            setPlayedCards([])
            setTrick(newTrickPackage.newTrick)
            setDealtCards(newTrickPackage.dealtCards)
            setPhaseOver({
                whatsOver: "",
                winnerId: null
            })
            setLeadSuit({})
            setWhosTurn(newTrickPackage.round.whosTurn)
        })

        socket.on("bet:submitted success", (betResponse) => {
            if (betResponse.badBetMessage) {
                alert(betResponse.badBetMessage)
            }
            setBetScores(betResponse.bets)
            setRound(betResponse.round)
            setWhosTurn(betResponse.round.whosTurn)
        })

        socket.on("round:next success", (roundPackage) => {
            setPhaseOver({
                whatsOver: "",
                winnerId: null
            })
            setPlayedCards([])
            setLeadSuit({})
            setDealtCards(roundPackage.deck)
            setTrick(roundPackage.trick)
            setRound(roundPackage.round)
            setDealtCards(roundPackage.deck)
            setWhosTurn(roundPackage.round.whosTurn)
            setDealerId(roundPackage.round.dealerId)
            setBetScores()
        })

    },[])

    useEffect(() => {
        return () => {socket.disconnect()}
    }, [gameId])

    const betSubmitter = (bet) => {
        socket.emit("bet:submitted", user, gameInfo, bet, round)
    }

    if (players?.length >= gameInfo?.numberOfPlayers && gameInfo.acceptingRegistrants && !gameStarted) {
        socket.emit("game: full", gameInfo)
    }

    const nextGamePhase = () => {
        if (phaseOver.whatsOver == "game") {
            console.log("GAME OVER!")
        } else if (phaseOver.whatsOver == "round") {
            socket.emit("round:next", gameInfo, round)
        } else {
            socket.emit("trick:next", gameInfo.id, round)
        }
    }

    const sendMessage = (newMessage) => {
        socket.emit("chat message", newMessage, gameId)
    }

    let trumpCard
    if (dealtCards?.length > 0) {
        trumpCard = dealtCards.find(card => card.trump == true)
    }

    const playCard = (card) => {
        socket.emit("card:played", gameInfo, round, trick, card)
    }

    let sumOfCurrentBets = 0
    if (round?.phase == "betting" && betScores) {
        sumOfCurrentBets = betScores.reduce((accumulator, nextBet) => accumulator + nextBet.bet, 0)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setShouldRedirect(true)
    }

    if (shouldRedirect === true ) {
        return <Redirect to={{
            pathname: "/"
            }}
        />
    }

    let playerTiles = []
    if (phaseOver.whatsOver == "game") {
        let winnerSummary = []
        let gameOverDisplay = (
            <div key="user.id">
                <h1>Game Over!</h1>
                <br/>
                {winnerSummary}
                <br/>
                <button className="button" type="button" onClick={handleSubmit}>Click to Return to Home Screen</button>
            </div>
        )
        players.map(player => {
            if (player.wonGame) {
                winnerSummary.push(
                    <div className="winner-summary" key={player.userId}>
                        {player.username} won with {player.gameScore} points!
                    </div>
                )
            }
        })
        playerTiles.push(gameOverDisplay)
    } else if (gameInfo) {
        for (let i = 0; i < gameInfo.numberOfPlayers; i++) {
            let tileDealtCards = []
            if (dealtCards && players[i]) {
                tileDealtCards = dealtCards.filter(card => card.userId == players[i].id)
                tileDealtCards.sort((a, b) => {
                    if (a.trump > b.trump) {
                        return -1
                    } else if (a.trump < b.trump) {
                        return 1
                    } else if (a.suitId > b.suitId) {
                        return 1
                    } else if ( a.suitId < b.suitId) {
                        return -1
                    } else if (a.baseValue > b.baseValue) {
                        return -1
                    } else if (a.baseValue < b.baseValue) {
                        return 1
                    }
                })
            } else {
                tileDealtCards = []
            }
            
            let playerBetScore
            if (betScores) {
                playerBetScore = betScores.find(bet => bet?.userId == players[i].id)
            }

            let tile = (
                <PlayerTile
                    key={i}
                    user={user}
                    gameInfo={gameInfo}
                    player={players[i]}
                    tileDealtCards={tileDealtCards}
                    playCard={playCard}
                    playedCards={playedCards}
                    round={round}
                    whosTurn={whosTurn}
                    leadSuit={leadSuit}
                    phaseOver={phaseOver}
                    playerBetScore={playerBetScore}
                    nextGamePhase={nextGamePhase}
                    betSubmitter={betSubmitter}
                    gameStarted={gameStarted}
                    handleStart={handleStart}
                    sumOfCurrentBets={sumOfCurrentBets}
                />
            )
            if (players[i]?.id == user.id) {
                playerTiles.unshift(tile)
            } else {
                playerTiles.push(tile)
            }
        }
    }    

    return (
        <div className="grid-x">
            <div className="cell small-9 gameboard" key="gameboards">
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
                        phaseOver={phaseOver}
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
