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

    const { gameId } = rest.computedMatch.params
    // console.log("Game User", user)

    const handleStart = () => {
        // console.log("handleStart started")
        socket.emit("game:start", gameInfo, players)
        // setGameStarted(true)
    }

    // console.log("players", players)
    console.log("GameShow gameInfo", gameInfo)
    console.log("GameShow phaseOver", phaseOver)
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
        
        socket.on('card:played trickAndRoundOver', (playCardResponse) => {
            console.log('card:played trickAndRoundOver')
            setPlayedCards(playCardResponse.playedCards)
            // setTrickOver({
            //     isOver: playCardResponse.trickOver,
            //     winnerId: playCardResponse.winnerId
            // })
            setPhaseOver({
                whatsOver: "round",
                winnerId: playCardResponse.phaseOver.winnerId
            })
            // setRoundOver(true)
            // setDealerId(null)
            setWhosTurn(null)
            // setLeadSuit({})
        // playCardResponse = {
        //     phaseOver: {
        //        whatsOver: round,
        //        winnerId: 1
        //     }
        //     playedCards: [playedCards]
        //     whosTurn: userId
        //     newTrick: newTrick
        // }

        })

        socket.on('card:played trickOver', (playCardResponse) => {
            console.log('card:played trickOver')
            setPlayedCards(playCardResponse.playedCards)
            // setTrickOver({
            //     isOver: true,
            //     winnerId: playCardResponse.winnerId
            // })
            setPhaseOver({
                whatsOver: "trick",
                winnerId: playCardResponse.phaseOver.winnerId
            })
            setWhosTurn(null)
            // setLeadSuit({})
        // playCardResponse = {
        //     trickOver: true,
        //     roundOver: false,
        //     winnerId: userId,
        //     playedCards: [playedCards]
        //     whosTurn: userId
        //     newTrick: newTrick
        // }
        })

        socket.on('card:played success', (playCardResponse) => {
            // console.log('card:played success', playCardResponse)
            setPlayedCards(playCardResponse.playedCards)
            setWhosTurn(playCardResponse.whosTurn)
            setLeadSuit(playCardResponse.leadSuit)
        // playCardResponse = {
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
            setPhaseOver({
                whatsOver: "",
                winnerId: null
            })
            setLeadSuit({})
            setWhosTurn(newTrickPackage.lastTrickWinnerId)
        })

        socket.on("bet:submitted success", (betResponse) => {
            console.log("bet:submitted success", betResponse)
            setBetScores(betResponse.bets)
            setRound(betResponse.round)
            setWhosTurn(betResponse.round.whosTurn)
        })

        socket.on("round:next success", (roundPackage) => {
            console.log("round:next success", roundPackage)
            // const dealer = roundPackage.dealerOrder[round.numberOfTricks]
            // setTrickOver({
            //     isOver: false,
            //     winnerId: null
            // })
            setPhaseOver({
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

    const betSubmitter = (bet) => {
        console.log("betSubmitter bet", bet)
        socket.emit("bet:submitted", user, gameInfo, bet, round)
    }

    if (players?.length >= gameInfo?.numberOfPlayers && gameInfo.acceptingRegistrants && !gameStarted) {
        socket.emit("game: full", gameInfo)
    }

    const nextGamePhase = () => {
        // console.log("nextGamePhase roundOver", roundOver)
        console.log("nextGamePhase phaseOver", phaseOver)
        if (phaseOver.whatsOver == "round") {
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
            
            let playerBetScore
            console.log("GameShow before decision betScores", betScores)
            // if (betScores?.length > 0 && betScores[0]?.userId) {
            if (betScores[0]) {
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
                />
            )
            if (players[i]?.id == user.id) {
                playerTiles.unshift(tile)
            } else {
                playerTiles.push(tile)
            }
        }
    }
    
    // console.log(gameStarted)
    

    return (
        <div className="grid-x">
            <div className="cell small-9 gameboard">
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
