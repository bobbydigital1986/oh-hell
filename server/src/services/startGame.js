import { Card, Game, Round } from "../models/index.js"


const startGame = async(gameId, players) => {
    console.log("startGame gameId", gameId)
    console.log("startGame players", players)
    
    const findGame = await Game.query().findById(gameId)

    const alternatingPlayersArray = await Game.setDealerOrder(findGame, players)
    console.log("setDealers", alternatingPlayersArray)
    const existingRounds = await Round.query().where("gameId", findGame.id)
    const newRoundNumber = existingRounds.length + 1
    const newDealerId = alternatingPlayersArray[newRoundNumber - 1]

    const newRound = await Round.roundBuilder(gameId, newDealerId, newRoundNumber)
    console.log("newRound", newRound)

    const newDeck = await Card.assembleDeck(newRound[0], players)
    console.log("newDeck", newDeck)


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