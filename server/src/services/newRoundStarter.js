import { Card, Game, Round, Trick } from "../models/index.js"

const newRoundStarter = async (gameId, existingRound) => {
    console.log("BEGIN LOGS IN newRoundStarter")
    const game = await Game.query().findById(gameId)
    console.log("game",game)
    // const existingRounds = await Round.query().where("gameId", gameId)
    // console.log("existingRounds",existingRounds)

    // const existRoundCount = existingRounds.length
    // console.log("existRoundCount",existRoundCount)
    
    const newDealerId = game.dealerOrder[existingRound.numberOfTricks]
    console.log("newDealerId", newDealerId)

    const newRoundNumberOfTricks = existingRound.numberOfTricks + 1
    let whosFirst = game.dealerOrder[newRoundNumberOfTricks]
    if (!whosFirst) {
        whosFirst = game.dealerOrder[0]
    }

    console.log("newRoundNumber",newRoundNumberOfTricks)

    const newRound =await Round.roundBuilder(game.id, newDealerId, newRoundNumberOfTricks)

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