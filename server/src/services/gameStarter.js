import { Card, Game, Round, Trick } from "../models/index.js"


const gameStarter = async(gameInfo, players) => {
    const gameId = gameInfo.id
    console.log("startGame gameInfo", gameInfo)
    console.log("startGame players", players)
    
    // const findGame = await Game.query().findById(gameId)
    // console.log("startGame => findGame", gameInfo)

    const newGameInfo = await Game.setDealerOrder(gameInfo, players)
    console.log("startGame newGameInfo", newGameInfo)
    // const existingRounds = await Round.query().where("gameId", findGame.id)
    // findGame.dealerOrder = alternatingPlayersArray
    
    // let newRound
    // let newRoundNumberOfTricks
    // if (existingRounds.length > 0) {
        // console.log("caught the existing round", existingRounds)
        // newRoundNumberOfTricks = existingRounds.length + 1
        //THIS NEEDS TO BE UPDATED - AUTOMATICALLY ASSUMED WERE ON THE FIRST ROUND
        // newRound = existingRounds[0]
    // } else {
        //No existing rounds found
    let newRoundNumberOfTricks = 1
    const newDealerId = newGameInfo.dealerOrder[0]
    const whosTurnId = newGameInfo.dealerOrder[1]
    let newRound = await Round.roundBuilder(gameId, newDealerId, newRoundNumberOfTricks, whosTurnId)
    // }

    console.log("newRound", newRound)

    const newDeck = await Card.assembleDeck(newRound, players)
    console.log("newDeck", newDeck)

    let newTrick = await Trick.trickBuilder(newRound)
    // await findGame.$query().patch({ acceptingRegistrants: false })
    const gamePackage = {
        gameInfo: newGameInfo,
        round: newRound,
        trick: newTrick,
        deck: newDeck
    }


    return gamePackage


    // const roundGraph = [
    //     {
    //     "#id": "newRound",
    //     gameId: gameId,
    //     numberOfTricks: 1,
    //     dealerId: players[0].id
    //     }
    // ]
    // let dealerSet = false

    // roundGraph[0].hands = players.map((player) => {
    //     const handObject = {
    //         roundId: "#ref{newRound.id}",
    //         userId: player.id
    //     }
    //     return handObject
        
    // })

    // console.log("roundGraph", roundGraph)
    // players.map((player) => {
        
    //     let playerDealtCards = []
    //     for (let i = 0; i < numberOfTricks; i++) {
    //         playerDealtCards.push({ id: deck[cardIndex].id, handId: "#ref{freshHand.id}" })
    //         cardIndex++
    //     }
    //     roundGraph.hands.push({
    //         "#id": "freshHand",
    //         userId: player.id,
    //         roundId: newRound.id,
    //         cards: playerDealtCards,
    //         allowRefs: true
    //     })
    // })
    // console.log("started graph", roundGraph)
    // // const returnOfGraph = await Round.query().insertGraph(roundGraph, { allowRefs: true })
    // console.log("finished graph", returnOfGraph)



    // roundMegaGraph = {
    //     gameId: gameId,
    //     numberOfTricks: 1,

    // }


}


export default gameStarter