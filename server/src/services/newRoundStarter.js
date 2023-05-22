import { Card, Game, Round, Trick } from "../models/index.js"

const newRoundStarter = async (gameId) => {
    const game = await Game.query().findById(gameId)
    const existingRounds = await Round.query().where("gameId", gameId)
    const existRoundCount = existingRounds.length
    const newDealerId = game.dealerOrder[existRoundCount]
    const newRoundNumber = existRoundCount + 1
    const newRound = Round.roundBuilder(game.id, newDealerId, newRoundNumber)

    return newRound
}

export default newRoundStarter