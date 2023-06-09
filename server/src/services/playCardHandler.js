import { Registration, Round, Trick, Card, BetScore } from "../models/index.js"

const playCardHandler = async(game, round, trick, card) => {
    
    let playCardResponse = {
        phaseOver: {
            whatsOver: "", // trick, round, game
            winnerId: null
        },
        playedCards: []
    }
    console.log("playCard game", game)
    console.log("playCard round", round)
    console.log("playCard trick", trick)
    console.log("playCard card", card)

    const cardsPlayedPreviously = await Card.query().where('trickPlayedId', trick.id)
    console.log("playCard cardsPlayedPreviously query", cardsPlayedPreviously)
    if (cardsPlayedPreviously.length == 0) {
        //First card played in trick - set leadSuit
        const playedCard = await Card.query().patchAndFetchById(card.id, { trickPlayedId: trick.id, trickLeadSuit: trick.id })
        console.log("playCard playedCard query", playedCard)

        playCardResponse.playedCards = [...cardsPlayedPreviously, playedCard]
        playCardResponse.leadSuit = playedCard
        
        const playedCardUserId = parseInt(playedCard.userId)
        console.log("playedCardUserId", playedCardUserId)
        const playedCardUsersOrderIndex = game.dealerOrder.indexOf(playedCardUserId)
        console.log("playedCardUsersOrderIndex", playedCardUsersOrderIndex)
        
        let whosUpIndex = playedCardUsersOrderIndex + 1
        console.log("whosUpIndex", whosUpIndex)
        if (game.dealerOrder.length <= whosUpIndex) {
            console.log("hit the whosUp if statement, should be set to 0")
            whosUpIndex = 0
        }
        playCardResponse.whosTurn = game.dealerOrder[whosUpIndex]
        
        return  playCardResponse
    } else {
        //Not first card played in trick, evaluate if trick is over or not
        const ledCard = await Card.query()
            .select('suitId')
            .findOne({ trickLeadSuit: trick.id })
        const leadSuitId = ledCard.suitId
        console.log("playCard leadSuitId:", leadSuitId)
        
        let cardPlayedWithTrick
        //check if card played was lead suit and designate it as such in db
        if (card.suitId == leadSuitId) {
            //card matched lead suit
            cardPlayedWithTrick = await Card.query().patchAndFetchById(card.id, { trickPlayedId: trick.id, trickLeadSuit: trick.id })
        } else {
            //card did not match lead suit
            cardPlayedWithTrick = await Card.query().patchAndFetchById(card.id, { trickPlayedId: trick.id })
        }
        playCardResponse.playedCards = [...cardsPlayedPreviously, cardPlayedWithTrick]
        const cardPlayersSpotInRotation = game.dealerOrder.indexOf(cardPlayedWithTrick.userId)
        
        
        if (cardsPlayedPreviously.length + 1 == game.numberOfPlayers) {
            //Trick is over, evaluate winner & evaluate if round is over
            console.log("Trick is over, evaluate winner & evaluate if round is over")
            playCardResponse.phaseOver.whatsOver = "trick"

            const tricksPlayedSoFar = await Trick.query().where('roundId', round.id)

            const wonTrickObject = await Trick.determineTrickWinner(trick, tricksPlayedSoFar)
            console.log("playCard Trick winner", wonTrickObject)
            playCardResponse.phaseOver.winnerId = wonTrickObject.userId

            console.log("tricksPlayedSoFar", tricksPlayedSoFar)
            console.log("tricksPlayedSoFar round", round)

            const updatedBet = await BetScore.query()
                .increment("tricksWon", 1)
                .where({ userId: wonTrickObject.userId, roundId: round.id})
            console.log("number of bets updated:", updatedBet)

            const roundBets = await BetScore.query().where({ roundId: round.id })
            if (tricksPlayedSoFar.length < round.numberOfTricks) {
                //Round not over
                console.log("play card resolved as trick over only")
                // const newTrick = await Trick.trickBuilder(round)
                // playCardResponse.newTrick = newTrick 
                playCardResponse.whosTurn = wonTrickObject.userId //Winner plays first in next trick
                playCardResponse.betScores = roundBets

                return playCardResponse
            } else {
                //Round over
                console.log("Play card round over")
                // playCardResponse.roundOver = true
                
                let betGraph = []
                const resolvedBets = roundBets.map((betScore) => {
                    let betObject = {
                        id: betScore.id
                    }
                    //may need to set default of score to null so that State recognizes change in value
                    if (betScore.bet == betScore.tricksWon) {
                        const trickPointsAwarded = betScore.bet + 1
                        const newScore = trickPointsAwarded + betScore.score
                        betObject.score = newScore
                        betObject.registration = {
                            id: betScore.registrantId,
                            gameScore: newScore
                        }
                        betGraph.push(betObject)
                        return betScore
                    }
                    return betScore
                })
                if (betGraph.length > 0) {
                    const upsertResponse = await BetScore.query().upsertGraph(betGraph)
                    console.log("betScore upsert response", upsertResponse)
                }
                console.log("playCardHandler resolvedBets", resolvedBets)
                playCardResponse.betScores = resolvedBets
                
                const roundPhaseEnded = await Round.query().patchAndFetchById(round.id, { phase: "ended" })
                playCardResponse.phaseOver.whatsOver = "round"
                
                console.log("roundPhaseEnded", roundPhaseEnded)
                const currentPlayers = await Registration.query()
                    .where({ gameId: game.id })
                    .join('users', 'registrations.userId', 'users.id')
                    .select('registrations.userId as id', 'registrations.id as registrantId', 'users.username', 'registrations.gameScore', 'registrations.wonGame')
                    // .orderBy('registrations.gameScore', 'DESC')
                playCardResponse.players = currentPlayers
                console.log("playCardHandler currentPlayers", currentPlayers)
                const currentPlayersOrdered = currentPlayers.sort((a, b) => {b.gameScore - a.gameScore})
                console.log("playCardHandler currentPlayersOrdered", currentPlayersOrdered)
                if (roundPhaseEnded.numberOfTricks >= game.numberOfRounds) {
                    //Game over
                    console.log('CAUGHT THE GAMEOVER IF')
                    playCardResponse.phaseOver.whatsOver = "game"
                    playCardResponse.winners = []
                    for (let i = 0; i < currentPlayersOrdered.length; i++) {
                        let currentPlayerIndex = i
                        let nextPlayerIndex = i + 1

                        if (nextPlayerIndex >= currentPlayersOrdered.length) {
                            nextPlayerIndex = 0
                        }

                        if (currentPlayersOrdered[currentPlayerIndex].gameScore > currentPlayersOrdered[nextPlayerIndex].gameScore) {
                            let gameWinner = await Registration.query().patchAndFetchById(currentPlayersOrdered[currentPlayerIndex].registrantId, {wonGame: true})
                            console.log("gameWinner should end for loop i is", i, "gameWinner is:", gameWinner)
                            playCardResponse.winners.push(gameWinner)
                            currentPlayersOrdered[currentPlayerIndex].wonGame = true
                            i = currentPlayersOrdered.length
                        } else if (currentPlayersOrdered[currentPlayerIndex].gameScore = currentPlayersOrdered[nextPlayerIndex].gameScore) {
                            let gameWinner = await Registration.query().patchAndFetchById(currentPlayersOrdered[currentPlayerIndex].registrantId, {wonGame: true})
                            playCardResponse.winners.push(gameWinner)
                            currentPlayersOrdered[currentPlayerIndex].wonGame = true
                            console.log("gameWinner continuing loop i is", i, "gameWinner is:", gameWinner)
                        } else {
                            console.log("missed the gameWinner ifs, i is:", i)
                        }
                    }
                    console.log("playCardResponse gameOver:", playCardResponse)
                    return playCardResponse
                }
                return playCardResponse
            }
        } else {
            //Not first card played but Trick is not over
            console.log("Trick not over")
            const playedCardUsersOrderIndex = game.dealerOrder.indexOf(card.userId)
            let whosUpIndex = playedCardUsersOrderIndex + 1
            if (!game.dealerOrder[whosUpIndex]) {
                whosUpIndex = 0
            }
            playCardResponse.whosTurn = game.dealerOrder[whosUpIndex]
            
            return playCardResponse
        }
    }
}

export default playCardHandler