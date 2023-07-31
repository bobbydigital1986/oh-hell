const Model = require("./Model.js")

class Trick extends Model {
    static get tableName() {
        return "tricks"
    }

    static get relationMappings() {
        const { Card, User, Round, BetScore } = require("./index.js")

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
        const newTrick = await Trick.query().insertAndFetch({ roundId: round.id })
        return newTrick
    }

    static async determineTrickWinner(trick, tricksPlayedSoFar) {
        const { Card } = require("./index.js")

        const trickPlayed = tricksPlayedSoFar.find(trickPlayed => trickPlayed.id == trick.id)
        const trickPlayedCards = await trickPlayed.$relatedQuery("cardsPlayed")
        const playersAndComputedScore = trickPlayedCards.map(card => {
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

        const highestScore = playersAndComputedScore.reduce((highScore, compareScore) => 
            highScore.computedValue < compareScore.computedValue ? compareScore : highScore
        )

        const setTrickOver = await trickPlayed.$query().patch({ phase: "ended" })
        const setWinnerOfTrick = await trickPlayed.$relatedQuery("winner").relate(highestScore.userId)

        return highestScore
    }
}

module.exports = Trick