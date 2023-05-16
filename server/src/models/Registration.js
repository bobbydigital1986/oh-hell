const Model = require("./Model.js")

class Registration extends Model {
    static get tableName() {
        return "registrations"
    }

    static get relationMappings() {
        const { Registration, Game } = require("./index.js")
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: Registration,
                join: {
                    from: "registrations.userId",
                    to: "users.id"
                }
            },

            game: {
                relation: Model.BelongsToOneRelation,
                modelClass: Game,
                join: {
                    from: "registrations.userId",
                    to: "games.id"
                }
            }
        }
    }
}

module.exports = Registration