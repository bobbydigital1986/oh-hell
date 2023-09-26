import { Registration, Round, Trick, Card, BetScore, Game } from "../models/index.js"

const playCardHandler = async(game, round, trick, card) => {
    
    let playCardResponse = {
        phaseOver: {
            whatsOver: "", // trick, round, game
            winnerId: null
        },
        playedCards: []
    }

    const cardsPlayedPreviously = await Card.query().where('trickPlayedId', trick.id)
    if (cardsPlayedPreviously.length == 0) {
        const playedCard = await Card.query().patchAndFetchById(card.id, { trickPlayedId: trick.id, trickLeadSuit: trick.id })
        const trickInPlay = await Trick.query().patchAndFetchById(trick.id, { phase: "playing" })

        playCardResponse.playedCards = [...cardsPlayedPreviously, playedCard]
        playCardResponse.leadSuit = playedCard
        
        let playedCardUserId = parseInt(playedCard.userId)
        const playedCardUsersOrderIndex = game.dealerOrder.indexOf(playedCardUserId)
        
        let whosUpIndex = playedCardUsersOrderIndex + 1
        if (game.dealerOrder.length <= whosUpIndex) {
            whosUpIndex = 0
        }
        const roundWithWhosTurnFirstCardPlayed = await Round.query().patchAndFetchById(round.id, { whosTurn: game.dealerOrder[whosUpIndex] })
        playCardResponse.round = roundWithWhosTurnFirstCardPlayed
        
        return  playCardResponse
    } else {
        //Not first card played in trick, evaluate if trick is over or not
        const ledCard = await Card.query()
            .select('suitId')
            .findOne({ trickLeadSuit: trick.id })
        const leadSuitId = ledCard.suitId
        
        let cardPlayedWithTrick
        //check if card played was lead suit and designate it as such in db
        if (card.suitId == leadSuitId) {
            //card matched lead suit
            cardPlayedWithTrick = await Card.query().patchAndFetchById(card.id, { trickPlayedId: trick.id, trickLeadSuit: trick.id })
        } else {
            //card did not match lead suit
            let doesPlayerHaveLeadSuit = await Card.query().findOne({ userId: card.userId, roundId: round.id, trickPlayedId: null, suitId: leadSuitId})
            if (doesPlayerHaveLeadSuit) {
                //Player had lead suit and should not have been able to play
                console.log(
                    `PLAYER PLAYED NON-LEAD BUT HAD LEAD`
                )
                cardPlayedWithTrick = await Card.query().findOne({ id: card.id })
                playCardResponse.error = "playLead"
            } else {
                //Player did not have lead suit in hand. Card is valid
                cardPlayedWithTrick = await Card.query().patchAndFetchById(card.id, { trickPlayedId: trick.id })
            }
        }
        playCardResponse.playedCards = [...cardsPlayedPreviously, cardPlayedWithTrick]
        const cardPlayersSpotInRotation = game.dealerOrder.indexOf(cardPlayedWithTrick.userId)
        
        
        if (cardsPlayedPreviously.length + 1 == game.numberOfPlayers) {
            //Trick is over, evaluate winner & evaluate if round is over
            playCardResponse.phaseOver.whatsOver = "trick"

            const tricksPlayedSoFar = await Trick.query().where('roundId', round.id)

            const wonTrickObject = await Trick.determineTrickWinner(trick, tricksPlayedSoFar)
            playCardResponse.phaseOver.winnerId = wonTrickObject.userId

            const updatedBet = await BetScore.query()
                .increment("tricksWon", 1)
                .where({ userId: wonTrickObject.userId, roundId: round.id})

            const roundBets = await BetScore.query().where({ roundId: round.id })
            if (tricksPlayedSoFar.length < round.numberOfTricks) {
                //Round not over
                const roundWithWhosTurnRoundNotOver = await Round.query().patchAndFetchById(round.id, { whosTurn: wonTrickObject.userId })
                playCardResponse.round = roundWithWhosTurnRoundNotOver
                playCardResponse.betScores = roundBets

                return playCardResponse
            } else {
                //Round over
                
                let betGraph = []
                let currentRegistrations = await Registration.query().where({ gameId: game.id })
                const resolvedBets = roundBets.map((betScore) => {
                    let betObject = {
                        id: betScore.id
                    }
                    if (betScore.bet == betScore.tricksWon) {
                        const trickPointsAwarded = betScore.bet + 1
                        const matchingRegistrant = currentRegistrations.find(registrant => registrant.id == betScore.registrantId)
                        const newScore = trickPointsAwarded + matchingRegistrant.gameScore
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
                }
                playCardResponse.betScores = resolvedBets
                
                const roundPhaseEnded = await Round.query().patchAndFetchById(round.id, { phase: "ended" })
                playCardResponse.phaseOver.whatsOver = "round"
                
                const currentPlayers = await Registration.query()
                    .where({ gameId: game.id })
                    .join('users', 'registrations.userId', 'users.id')
                    .select('registrations.userId as id', 'registrations.id as registrantId', 'users.username', 'registrations.gameScore', 'registrations.wonGame')
                playCardResponse.players = currentPlayers
                const currentPlayersOrdered = currentPlayers.sort((a, b) => { return b.gameScore - a.gameScore})
                if (roundPhaseEnded.numberOfTricks >= game.numberOfRounds) {
                    //Game over
                    playCardResponse.phaseOver.whatsOver = "game"
                    const endedGame = await Game.query().patchAndFetchById(game.id, { gameOver: true })
                    playCardResponse.game = endedGame
                    playCardResponse.winners = []
                    for (let i = 0; i < currentPlayersOrdered.length; i++) {
                        let currentPlayerIndex = i
                        let nextPlayerIndex = i + 1

                        if (nextPlayerIndex >= currentPlayersOrdered.length) {
                            nextPlayerIndex = 0
                        }
                        //Game over bug is in here - sets gamescores to equal each other for some reason. playCardResponse.players starts out correct but becomes malformed
                        if (currentPlayersOrdered[currentPlayerIndex].gameScore > currentPlayersOrdered[nextPlayerIndex].gameScore) {
                            let gameWinner = await Registration.query().patchAndFetchById(currentPlayersOrdered[currentPlayerIndex].registrantId, {wonGame: true})
                            playCardResponse.winners.push(gameWinner)
                            currentPlayersOrdered[currentPlayerIndex].wonGame = true
                            i = currentPlayersOrdered.length
                        } else if (currentPlayersOrdered[currentPlayerIndex].gameScore = currentPlayersOrdered[nextPlayerIndex].gameScore) {
                            let gameWinner = await Registration.query().patchAndFetchById(currentPlayersOrdered[currentPlayerIndex].registrantId, {wonGame: true})
                            playCardResponse.winners.push(gameWinner)
                            currentPlayersOrdered[currentPlayerIndex].wonGame = true
                        } else {
                            console.log("ERRONEOUSLY missed the gameWinner ifs, i is:", i)
                        }
                    }
                    playCardResponse.players = await Registration.query()
                        .where({ gameId: game.id })
                        .join('users', 'registrations.userId', 'users.id')
                        .select('registrations.userId as id', 'registrations.id as registrantId', 'users.username', 'registrations.gameScore', 'registrations.wonGame')    
                    return playCardResponse
                }
                return playCardResponse
            }
        } else {
            //Not first card played but Trick is not over
            const playedCardUsersOrderIndex = game.dealerOrder.indexOf(parseInt(card.userId))
            let whosUpIndex = playedCardUsersOrderIndex + 1
            if (!game.dealerOrder[whosUpIndex]) {
                whosUpIndex = 0
            }
            const roundWithWhosUpTrickNotOver = await Round.query().patchAndFetchById(round.id, {whosTurn: game.dealerOrder[whosUpIndex]})
            playCardResponse.round = roundWithWhosUpTrickNotOver
            
            return playCardResponse
        }
    }
}

export default playCardHandler