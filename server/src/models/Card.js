const Model = require("./Model.js")
const _ = require("lodash")

class Card extends Model {
    static get tableName() {
        return "cards"
    }

    static async assembleDeck(round, players) {
        const { Round } = require("./index.js")
        console.log("round in assembleDeck", round)
        // Round {
        //     gameId: '2',
        //     numberOfTricks: 1,
        //     dealerId: '1',
        //     hands: [ [Hand] ],
        //     createdAt: '2023-05-18T13:58:44.036Z',
        //     updatedAt: '2023-05-18T13:58:44.036Z',
        //     id: '1'
        //   }
        const suits = ['♦', '♣', '♠', '♥']
        const suitsStrings = ['diamonds', 'clubs', 'spades', 'hearts']
        const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']


        let cards = []
        for (const suit of suits) {
            for (const rank of ranks) {
                let card = {}
                let rankIndex = ranks.indexOf(rank)
                let suitIndex = suits.indexOf(suit)

                card.displayString = `${rank}${suit}`
                card.rank = rank
                card.suit = suitsStrings[suitIndex]
                card.suitUnicode = suit
                card.baseValue = parseInt(rankIndex + 1)
                card.suitId = suitIndex + 1
                card.roundId = round.id                
                
                cards.push(card)   
            }
        }
        const shuffledDeck = _.shuffle(cards)
        let cardsPerPlayer = round.numberOfTricks
        let cardsDealt = 0
        let totalCardsToDeal = (cardsPerPlayer * players.length) + 1 //1 is for the trump card
        console.log("totalCardsToDeal", totalCardsToDeal)
        let playerIndex = 0
        let finalDeck = []
        let trumpSuitId
        for (let i = 0; i < totalCardsToDeal; i++) {
            
            if ((cardsDealt - 1) % cardsPerPlayer == 0 && cardsDealt != 1 && cardsDealt != 0) {
                console.log("Caught the playerIndex bump", cardsDealt, i)
                playerIndex++
            }
            if (i === 0) {
                shuffledDeck[i].trump = true
                trumpSuitId = shuffledDeck[i].suitId
                cardsDealt++
            } else {
                console.log("playerIndex", playerIndex)
                shuffledDeck[i].userId = players[playerIndex].id
                if (shuffledDeck[i].suitId == trumpSuitId) {
                    shuffledDeck[i].trump = true
                }
                cardsDealt++
            }
            finalDeck.push(shuffledDeck[i])
        }

        console.log("shuffledDeck", shuffledDeck[0])
        const newDeck = await Card.query().insertGraphAndFetch(finalDeck)
        
        
        return newDeck
    }
}



module.exports = Card