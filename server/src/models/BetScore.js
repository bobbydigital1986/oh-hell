const Model = require("./Model.js")

class BetScore extends Model {
    static get tableName() {
        return "betScores"
    }

    static get relationMappings() {
        const { Round, Registration } = require("./index.js")

        return {
            round: {
                relation: Model.BelongsToOneRelation,
                modelClass: Round,
                join: {
                    from: "betScores.roundId",
                    to: "rounds.id"
                }
            },

            registration: {
                relation: Model.BelongsToOneRelation,
                modelClass: Registration,
                join: {
                    from: "betScores.registrantId",
                    to: "registrations.id"
                }
            }
        }
    }

    async resolveRoundBets() {
        if(this.bet == this.tricksWon) {
            let score = this.bet + 1
            this.$query().patch({ score: score })
            return this
        } else {
            this.score = 0
            return this
        }
    }
}

module.exports = BetScore
