const Model = require("./Model.js")

class Round extends Model {
    static get tableName() {
        return "rounds"
    }

    static get relationMappings() {
        const { Hand, Game, Trick} = require("./index.js")

        return {
            hands: {
                relation: Model.HasManyRelation,
                modelClass: Hand,
                join: {
                    from: "rounds.id",
                    to: "hands.roundId"
                }
            }

        }
    }

    static async roundBuilder(gameId, newDealerId, newRoundNumber) {
        const { Game } = require("./index.js")
        // const numberOfRounds = Game.query().findById(gameId).numberOfRounds
        // const megaRoundGraph = []

        let oneRound = [{
            gameId: gameId,
            numberOfTricks: newRoundNumber,
            dealerId: newDealerId
        }]
        
        const returnOfGraph = await Round.query().insertGraphAndFetch(oneRound)
        return returnOfGraph
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