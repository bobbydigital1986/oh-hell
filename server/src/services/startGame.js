import { Card, Game, Round, Trick } from "../models/index.js"


const startGame = async(gameId, players) => {
    console.log("startGame gameId", gameId)
    console.log("startGame players", players)
    
    const findGame = await Game.query().findById(gameId)

    const alternatingPlayersArray = await Game.setDealerOrder(findGame, players)
    console.log("setDealers", alternatingPlayersArray)
    const existingRounds = await Round.query().where("gameId", findGame.id)
    findGame.dealerOrder = alternatingPlayersArray
    
    let newRound
    let newRoundNumber
    if (existingRounds.length > 0) {
        console.log("caught the existing round", existingRounds)
        newRoundNumber = existingRounds.length + 1
        //THIS NEEDS TO BE UPDATED - AUTOMATICALLY ASSUMED WERE ON THE FIRST ROUND
        newRound = existingRounds[0]
    } else {
        newRoundNumber = 1
        const newDealerId = alternatingPlayersArray[newRoundNumber - 1]
        newRound = await Round.roundBuilder(gameId, newDealerId, newRoundNumber)
    }

    console.log("newRound", newRound)

    const newDeck = await Card.assembleDeck(newRound, players)
    console.log("newDeck", newDeck)

    let newTrick = await Trick.trickBuilder(newRound)

    const gamePackage = {
        gameInfo: findGame,
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


export default startGame