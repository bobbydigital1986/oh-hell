const Model = require("./Model.js")

class Game extends Model {
    static get tableName() {
        return "games"
    }

    static get relationMappings() {
        const { User, Round, Registration, Trick } = require("./index.js")

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
                relation: Model.HasManyRelation,
                modelClass: Round,
                join: {
                    from: "games.id",
                    to: "rounds.gameId"
                }

            },

            currentRound: {
                relation: Model.BelongsToOne,
                modelClass: Round,
                join: {
                    from: "games.currentRoundId",
                    to: "rounds.id"
                }
            },

            players: {
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

    static async setDealerOrder(game) {
        const { Registration } = require("./index.js")
        const players = await Registration.query().where({ gameId: game.id })
        const numberOfPlayers = players.length
        let playerIndex = 0
        let alternatingPlayers = []

        for (let i = 0; i < game.numberOfRounds; i++) {
            let mod = i%numberOfPlayers
            let newDealerId = players[mod].userId
            alternatingPlayers.push(newDealerId)
        }
        const updatedGame = await Game.query().patchAndFetchById(game.id, { dealerOrder: alternatingPlayers, numberOfPlayers, acceptingRegistrants: false, gameStarted: true })
        return updatedGame
    }
}

module.exports = Game