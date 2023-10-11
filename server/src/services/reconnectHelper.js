import { Round, Registration } from "../models/index.js"

const reconnectHelper = async(game, user) => {

    let gameState = {
        players: [],
        gameInfo: game,
        round: {},
        trick: {},
        dealtCards: [],
        playedCards: [],
        whosTurn: {},
        gameStarted: game.gameStarted,
        leadSuit: {},
        messages: [],
        dealerId: null,
        betScores: [],
        phaseOver: {
            whatsOver: "",
            winnerId: null
        },
        shouldRedirect: false
    }

    gameState.players = await Registration.query()
        .where({ gameId: game.id })
        .join('users', 'registrations.userId', 'users.id')
        .select('registrations.userId as id', 'users.username', 'registrations.gameScore')

    const currentRoundArray = await game.$relatedQuery("rounds")
        .orderBy("createdAt", "desc")
        .limit(1)
    
    if (currentRoundArray.length > 0) {
        const currentRound = currentRoundArray[0]
        gameState.round = currentRound
        const currentTrickArray = await currentRound.$relatedQuery("tricks")
            .orderBy("createdAt", "desc")
            .limit(1)
        const currentTrick = currentTrickArray[0]
        gameState.trick = currentTrick
        
        const roundCards = await currentRound.$relatedQuery("cards")
        let dealtCards = []
        let playedCards = []
        let leadSuit = {}
    
        roundCards.map(roundCard => {
            if (roundCard.trickPlayedId == currentTrick.id) {
                playedCards.push(roundCard)
                if (roundCard.trickLeadSuit){
                    gameState.leadSuit = roundCard
                }
            } else {
                dealtCards.push(roundCard)
            }
        })
        gameState.dealtCards = dealtCards
        gameState.playedCards = playedCards
        gameState.leadSuit = leadSuit
        
        gameState.whosTurn = currentRound.whosTurn
        gameState.dealerId = currentRound.dealerId
        
        const betScores = await currentRound.$relatedQuery("betScores")
        gameState.betScores = betScores
    
        if (game.gameOver == true) {
            gameState.phaseOver = {
                whatsOver: "game",
                winnerId: null
            }
        } else if (currentRound.phase == "ended") {
            gameState.phaseOver = {
                whatsOver: "round",
                winnerId: currentTrick.winnerId
            }
        } else if (currentTrick.phase == "ended") {
            gameState.phaseOver = {
                whatsOver: "trick",
                winnerId: currentTrick.winnerId
            }
        }
    }
    return gameState
}

export default reconnectHelper