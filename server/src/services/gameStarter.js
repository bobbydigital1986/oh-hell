import { Card, Game, Round, Trick } from "../models/index.js"


const gameStarter = async(gameInfo, players) => {
    const gameId = gameInfo.id

    const newGameInfo = await Game.setDealerOrder(gameInfo)
    let newRoundNumberOfTricks = 1
    const newDealerId = newGameInfo.dealerOrder[0]
    const whosTurnId = newGameInfo.dealerOrder[1]
    let newRound = await Round.roundBuilder(gameId, newDealerId, newRoundNumberOfTricks, whosTurnId)

    const newDeck = await Card.assembleDeck(newRound, players)

    let newTrick = await Trick.trickBuilder(newRound)
    const gamePackage = {
        gameInfo: newGameInfo,
        round: newRound,
        trick: newTrick,
        deck: newDeck
    }

    return gamePackage
}


export default gameStarter