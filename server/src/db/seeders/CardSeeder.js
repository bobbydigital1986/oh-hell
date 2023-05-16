import { Card } from "../../index.js";

class CardSeeder {
    static async seed() {
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
                
                cards.push(card)
            }
        }
        await Card.insertGraph(cards)
    }
}

export default CardSeeder