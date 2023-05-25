const Model = require("./Model.js")

class BetScore extends Model {
    static get tableName() {
        return "betScores"
    }

    static get RelationMapping() {
        const { User, Round, Registration } = require("./index.js")

        return {
            round: {
                relation: Model.BelongsToOneRelation,
                modelClass: Round,
                join: {
                    from: "betScores.roundId",
                    to: "rounds.id"
                }
            },

            registrations: {
                relation: Model.BelongsToOneRelation,
                modelClass: Registration,
                join: {
                    from: "betScores.registrantId",
                    to: "registrations.id"
                }
            }
        }
    }
}

module.export = BetScore
