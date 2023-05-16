const Model = require("./Model.js")

class Game extends Model {
    static get tableName() {
        return "games"
    }

    static get relationMappings() {
        const { User, Round, Registration } = require("./index.js")

        return {
            owner: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "games.ownerId",
                    to: "users.id"
                }
            },

            rounds: {
                relation: Model.BelongsToOne,
                modelClass: Round,
                join: {
                    from: "games.currentRoundId",
                    to: "rounds.id"
                }
            },

            registrants: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: "games.id",
                    through: {
                        from: "registrations.gameId",
                        to: "registrations.userId"
                    },
                    to: "users.id"
                }
            }


        }
    }
}

module.exports = Game