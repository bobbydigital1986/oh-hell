const Model = require("./Model.js")

class Trick extends Model {
    static get tableName() {
        return "tricks"
    }

    static get relationMappings() {
        const { Card, User, Round } = require("./index.js")

        return {
            cardsPlayed: {
                relation: Model.HasManyRelation,
                modelClass: Card,
                join: {
                    from: "tricks.id",
                    to: "cards.trickPlayedId"
                },
            },
            cardLeadSuit: {
                relation: Model.HasOneRelation,
                modelClass: Card,
                join: {
                    from: "tricks.id",
                    to: "cards.trickLeadSuit"
                }
            },
            round: {
                relation: Model.BelongsToOneRelation,
                modelClass: Round,
                join: {
                    from: "tricks.roundId",
                    to: "rounds.id"
                }
            },
            winner: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "tricks.winnerId",
                    to: "users.id"
                }
            }
        }
    }

    static async trickBuilder(round) {
        // const { Round } = require("./index.js")

        const newTrick = await Trick.query().insertAndFetch({ roundId: round.id })
        console.log(newTrick)
        return newTrick
    }

    static async determineTrickWinner(trick) {
        const { Card } = require("./index.js")

        const trickPlayed = await Trick.query().findById(trick.id)
        console.log("determineTrickWinner trickPlayed query", trickPlayed)
        const freshCardsPlayedQuery = await trickPlayed.$relatedQuery("cardsPlayed")
        const playersAndComputedScore = freshCardsPlayedQuery.map(card => {
            let cardObject = {
                userId: card.userId,
                trickPlayedId: card.trickPlayedId,
                roundId: card.roundId,
            }
            if (card.trump === true) {
                card.computedValue = card.baseValue * 14
                return cardObject
            } else if (card.trickLeadSuit == card.trickPlayedId) {
                card.computedValue = card.baseValue
                return cardObject
            } else {
                card.computedValue = 0
                return cardObject
            }
        })
        const compareComputedValue = (a, b) => {
            return a.computedValue - b.computedValue
        }
        const sortedScores = playersAndComputedScore.sort(compareComputedValue).reverse()
        const winner = sortedScores[0]
        const setWinnerOfTrick = await trickPlayed.$relatedQuery("winner").relate(winner.userId)
        return winner
    }
}

module.exports = Trick