import { Card, Game, Round, Trick } from "../models/index.js"

const newRoundStarter = async (gameId, existingRound) => {
    const game = await Game.query().findById(gameId)
    const newDealerId = game.dealerOrder[existingRound.numberOfTricks]

    const newRoundNumberOfTricks = existingRound.numberOfTricks + 1
    let whosTurnId = game.dealerOrder[newRoundNumberOfTricks]
    if (!whosTurnId) {
        whosTurnId = game.dealerOrder[0]
        if (whosTurnId == newDealerId) {
            whosTurnId = game.dealerOrder[1]
        }
    }

    const newRound = await Round.roundBuilder(game.id, newDealerId, newRoundNumberOfTricks, whosTurnId)

    const players = await game.$relatedQuery("players")

    const newDeck = await Card.assembleDeck(newRound, players)

    let newTrick = await Trick.trickBuilder(newRound)

    const roundPackage = {
        gameInfo: game,
        round: newRound,
        trick: newTrick,
        deck: newDeck
    }
    
    return roundPackage
}

export default newRoundStarter