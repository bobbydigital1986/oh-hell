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

    static async setDealerOrder(game, players) {
        console.log("game => setDealerOrder game", game)
        console.log("game => setDealerOrder players", players)
        const numberOfPlayers = players.length
        console.log("Game => setDealerOrder numberOfPlayers", numberOfPlayers)
        let playerIndex = 0
        let alternatingPlayers = []

        for (let i = 0; i < game.numberOfRounds; i++) {
            console.log(alternatingPlayers)
            console.log("playerIndex", playerIndex)
            console.log(i)
            console.log("players[playerIndex]", players[playerIndex])
            console.log("players[playerIndex].id", players[playerIndex]?.id)
            let newDealerId = players[playerIndex]?.id
            if (!players[playerIndex]) {
                playerIndex = 0
                newDealerId = players[0].id
            } else {
                playerIndex++
            }
            alternatingPlayers.unshift(newDealerId)
        }
        const updatedGame = await Game.query().patchAndFetchById(game.id, { dealerOrder: alternatingPlayers, numberOfPlayers, acceptingRegistrants: false })
        return updatedGame
    }
}

module.exports = Game