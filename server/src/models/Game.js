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

    static async setDealerOrder(findGame, players) {
        console.log("game => findGame", findGame)
        console.log("game => setDealerOrder", players)
        const numberOfPlayers = players.length
        let playerIndex = 0
        let alternatingPlayers = []
        for (let i = 0; i < findGame.numberOfRounds; i++) {
            console.log(alternatingPlayers)
            console.log("playerIndex", playerIndex)
            console.log(i)
            alternatingPlayers.push(players[playerIndex].id)
            playerIndex++
            if (i >= players.length - 1) {
                playerIndex = 0
            }
        }
        const updatedGame = await findGame.$query().patch({ dealerOrder: alternatingPlayers, numberOfPlayers })
        return alternatingPlayers
    }
}

module.exports = Game