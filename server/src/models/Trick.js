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
        console.log("Trick => determineTrickWinner freshCardsPlayedQuery", freshCardsPlayedQuery)
        const playersAndComputedScore = freshCardsPlayedQuery.map(card => {
            let cardObject = {
                userId: card.userId,
                trickPlayedId: card.trickPlayedId,
                roundId: card.roundId,
                cardDisplayString: card.displayString,
                cardBaseValue: card.baseValue,
                cardtrickLeadSuit: card.trickLeadSuit
            }
            if (card.trump === true) {
                cardObject.computedValue = card.baseValue * 14
                return cardObject
            } else if (card.trickLeadSuit == card.trickPlayedId) {
                cardObject.computedValue = card.baseValue
                return cardObject
            } else {
                cardObject.computedValue = 0
                return cardObject
            }
        })
        const compareComputedValue = (a, b) => {
            return a.computedValue - b.computedValue
        }
        console.log("determineTrickwinner playersAndComputedScore", playersAndComputedScore)
        const sortedScores = playersAndComputedScore.sort(compareComputedValue).reverse()
        console.log("determineTrickwinner sortedScores", sortedScores)
        const winner = sortedScores[0]
        console.log("determineTrickwinner winner", winner)
        const setWinnerOfTrick = await trickPlayed.$relatedQuery("winner").relate(winner.userId)
        console.log("determineTrickwinner setWinnerOfTrick", setWinnerOfTrick)
        return winner
    }
}

module.exports = Trick