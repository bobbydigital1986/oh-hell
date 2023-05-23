import { Card, Game, Round, Trick } from "../models/index.js"

const newRoundStarter = async (gameId) => {
    console.log("BEGIN LOGS IN newRoundStarter")
    const game = await Game.query().findById(gameId)
    console.log("game",game)
    const existingRounds = await Round.query().where("gameId", gameId)
    console.log("existingRounds",existingRounds)

    const existRoundCount = existingRounds.length
    console.log("existRoundCount",existRoundCount)

    
    const newDealerId = game.dealerOrder[existRoundCount]
    console.log("newDealerId",newDealerId)
    let whosFirst = game.dealerOrder[existRoundCount + 1]
    if (!whosFirst) {
        whosFirst = game.dealerOrder[0]
    }

    const newRoundNumber = existRoundCount + 1
    console.log("newRoundNumber",newRoundNumber)

    const newRound =await Round.roundBuilder(game.id, newDealerId, newRoundNumber)

    const players = await game.$relatedQuery("players")

    const newDeck = await Card.assembleDeck(newRound, players)
    console.log("newDeck", newDeck)

    let newTrick = await Trick.trickBuilder(newRound)

    const roundPackage = {
        gameInfo: game,
        round: newRound,
        trick: newTrick,
        deck: newDeck,
        whosTurn: whosFirst
    }
    
    return roundPackage
}

export default newRoundStarter