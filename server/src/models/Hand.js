const Model = require("./Model.js")

class Hand extends Model {
    static get tableName() {
        return "hands"
    }

    static get RelationMapping() {
        const { User, Round, Card } = require("./index.js")

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "hands.userId",
                    to: "users.id"
                }
            },

            rounds: {
                relation: Model.BelongsToOneRelation,
                modelClass: Round,
                join: {
                    from: "hands.roundId",
                    to: "rounds.id"
                }
            },

            cards: {
                relation: Model.HasManyRelation,
                modelClass: Card,
                join: {
                    from: "hands.id",
                    to: "cards.handId"
                }
            }
        }
    }

}

module.exports = Hand