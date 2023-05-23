const Model = require("./Model.js")

class Round extends Model {
    static get tableName() {
        return "rounds"
    }

    static get relationMappings() {
        const { Card, Trick } = require("./index.js")

        return {
            tricks: {
                relation: Model.HasManyRelation,
                modelClass: Trick,
                join: {
                    from: "rounds.id",
                    to: "tricks.roundId"
                }
            },

            cards: {
                relation: Model.HasManyRelation,
                modelClass: Card,
                join: {
                    from: "rounds.id",
                    to: "cards.roundId"
                }
            }

        }
    }

    static async roundBuilder(gameId, newDealerId, newRoundNumber) {
        const { Game } = require("./index.js")
        // const numberOfRounds = Game.query().findById(gameId).numberOfRounds
        // const megaRoundGraph = []
        console.log("roundBuilding gameIdr", gameId)
        console.log("roundBuilding newDealerId", newDealerId)
        console.log("roundBuilding Round number", newRoundNumber)
        let roundNumber = newRoundNumber
        if (!newRoundNumber) {
            roundNumber = 1
        }

        let oneRound = [{
            gameId: gameId,
            numberOfTricks: newRoundNumber,
            dealerId: newDealerId
        }]
        
        const returnOfGraph = await Round.query().insertGraphAndFetch(oneRound)
        console.log("roundBuidler return of graph", returnOfGraph)
        return returnOfGraph[0]
        // const roundGraph = [
        //     {
        //     "#id": `newRound${i}`,
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
    }
}

module.exports = Round