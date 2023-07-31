const Model = require("./Model.js")

class Round extends Model {
    static get tableName() {
        return "rounds"
    }

    static get relationMappings() {
        const { Card, Trick, BetScore, User } = require("./index.js")

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
            },

            betScores: {
                relation: Model.HasManyRelation,
                modelClass: BetScore,
                join: {
                    from: "rounds.id",
                    to: "betScores.roundId"
                }
            },

            users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: "rounds.id",
                    through: {
                        from: "cards.roundId",
                        to: "cards.userId"
                    },
                    to: "users.id"
                }
            }

        }
    }

    static async roundBuilder(gameId, newDealerId, newRoundNumberOfTricks, whosTurnId) {
        const { Game } = require("./index.js")
        let oneRound = [{
            gameId: gameId,
            numberOfTricks: newRoundNumberOfTricks,
            dealerId: newDealerId,
            phase: "betting",
            whosTurn: whosTurnId
        }]
        
        const returnOfGraph = await Round.query().insertGraphAndFetch(oneRound)        
        
        return Round.roundSerializer(returnOfGraph[0])
    }

    static roundSerializer(round) {
        const allowedAttributes = ["id", "gameId", "numberOfTricks", "dealerId", "whosTurn", "phase"]
        let serializedRound = {}
        for (const attribute of allowedAttributes) {
            serializedRound[attribute] = round[attribute]
        }
        return serializedRound
    }
}

module.exports = Round