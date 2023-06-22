const Model = require("./Model.js")
const _ = require("lodash")

class Card extends Model {
    static get tableName() {
        return "cards"
    }

    static async assembleDeck(round, players) {
        const { Round } = require("./index.js")
        console.log("round in assembleDeck", round)

        const suits = ['♦', '♣', '♠', '♥']
        const suitsStrings = ['diamonds', 'clubs', 'spades', 'hearts']
        const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']

        const imageURLS = [
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/10_of_clubs.png", displayname:"10♣"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/10_of_diamonds.png", displayname:"10♦"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/10_of_hearts.png", displayname:"10♥"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/10_of_spades.png", displayname:"10♠"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/2_of_clubs.png", displayname:"2♣"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/2_of_diamonds.png", displayname:"2♦"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/2_of_hearts.png", displayname:"2♥"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/2_of_spades.png", displayname:"2♠"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/3_of_clubs.png", displayname:"3♣"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/3_of_diamonds.png", displayname:"3♦"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/3_of_hearts.png", displayname:"3♥"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/3_of_spades.png", displayname:"3♠"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/4_of_clubs.png", displayname:"4♣"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/4_of_diamonds.png", displayname:"4♦"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/4_of_hearts.png", displayname:"4♥"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/4_of_spades.png", displayname:"4♠"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/5_of_clubs.png", displayname:"5♣"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/5_of_diamonds.png", displayname:"5♦"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/5_of_hearts.png", displayname:"5♥"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/5_of_spades.png", displayname:"5♠"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/6_of_clubs.png", displayname:"6♣"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/6_of_diamonds.png", displayname:"6♦"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/6_of_hearts.png", displayname:"6♥"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/6_of_spades.png", displayname:"6♠"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/7_of_clubs.png", displayname:"7♣"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/7_of_diamonds.png", displayname:"7♦"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/7_of_hearts.png", displayname:"7♥"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/7_of_spades.png", displayname:"7♠"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/8_of_clubs.png", displayname:"8♣"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/8_of_diamonds.png", displayname:"8♦"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/8_of_hearts.png", displayname:"8♥"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/8_of_spades.png", displayname:"8♠"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/9_of_clubs.png", displayname:"9♣"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/9_of_diamonds.png", displayname:"9♦"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/9_of_hearts.png", displayname:"9♥"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/9_of_spades.png", displayname:"9♠"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/ace_of_clubs.png", displayname:"A♣"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/ace_of_diamonds.png", displayname:"A♦"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/ace_of_hearts.png", displayname:"A♥"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/ace_of_spades.png", displayname:"A♠"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/jack_of_clubs2.png", displayname:"J♣"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/jack_of_diamonds2.png", displayname:"J♦"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/jack_of_hearts2.png", displayname:"J♥"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/jack_of_spades2.png", displayname:"J♠"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/king_of_clubs2.png", displayname:"K♣"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/king_of_diamonds2.png", displayname:"K♦"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/king_of_hearts2.png", displayname:"K♥"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/king_of_spades2.png", displayname:"K♠"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/queen_of_clubs2.png", displayname:"Q♣"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/queen_of_diamonds2.png", displayname:"Q♦"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/queen_of_hearts2.png", displayname:"Q♥"}, 
            {url:"https://oh-hell.s3.us-east-2.amazonaws.com/queen_of_spades2.png", displayname:"Q♠"}
        ]


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
                card.faceDownImageURL = 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png'
                
                let matchingImageHash = imageURLS.find(hash => hash.displayname == `${rank}${suit}`)
                card.faceUpImageURL = matchingImageHash.url
                
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


    const allCards = [
        {
        displayString: '2♦',
        rank: 2,
        suit: 'diamonds',
        suitUnicode: '♦',
        baseValue: 1,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/2_of_diamonds.png'
        },
        {
        displayString: '3♦',
        rank: 3,
        suit: 'diamonds',
        suitUnicode: '♦',
        baseValue: 2,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/3_of_diamonds.png'
        },
        {
        displayString: '4♦',
        rank: 4,
        suit: 'diamonds',
        suitUnicode: '♦',
        baseValue: 3,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/4_of_diamonds.png'
        },
        {
        displayString: '5♦',
        rank: 5,
        suit: 'diamonds',
        suitUnicode: '♦',
        baseValue: 4,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/5_of_diamonds.png'
        },
        {
        displayString: '6♦',
        rank: 6,
        suit: 'diamonds',
        suitUnicode: '♦',
        baseValue: 5,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/6_of_diamonds.png'
        },
        {
        displayString: '7♦',
        rank: 7,
        suit: 'diamonds',
        suitUnicode: '♦',
        baseValue: 6,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/7_of_diamonds.png'
        },
        {
        displayString: '8♦',
        rank: 8,
        suit: 'diamonds',
        suitUnicode: '♦',
        baseValue: 7,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/8_of_diamonds.png'
        },
        {
        displayString: '9♦',
        rank: 9,
        suit: 'diamonds',
        suitUnicode: '♦',
        baseValue: 8,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/9_of_diamonds.png'
        },
        {
        displayString: '10♦',
        rank: 10,
        suit: 'diamonds',
        suitUnicode: '♦',
        baseValue: 9,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/10_of_diamonds.png'
        },
        {
        displayString: 'J♦',
        rank: 'J',
        suit: 'diamonds',
        suitUnicode: '♦',
        baseValue: 10,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/jack_of_diamonds2.png'
        },
        {
        displayString: 'Q♦',
        rank: 'Q',
        suit: 'diamonds',
        suitUnicode: '♦',
        baseValue: 11,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/queen_of_diamonds2.png'
        },
        {
        displayString: 'K♦',
        rank: 'K',
        suit: 'diamonds',
        suitUnicode: '♦',
        baseValue: 12,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/king_of_diamonds2.png'
        },
        {
        displayString: 'A♦',
        rank: 'A',
        suit: 'diamonds',
        suitUnicode: '♦',
        baseValue: 13,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/ace_of_diamonds.png'
        },
        {
        displayString: '2♣',
        rank: 2,
        suit: 'clubs',
        suitUnicode: '♣',
        baseValue: 1,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/2_of_clubs.png'
        },
        {
        displayString: '3♣',
        rank: 3,
        suit: 'clubs',
        suitUnicode: '♣',
        baseValue: 2,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/3_of_clubs.png'
        },
        {
        displayString: '4♣',
        rank: 4,
        suit: 'clubs',
        suitUnicode: '♣',
        baseValue: 3,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/4_of_clubs.png'
        },
        {
        displayString: '5♣',
        rank: 5,
        suit: 'clubs',
        suitUnicode: '♣',
        baseValue: 4,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/5_of_clubs.png'
        },
        {
        displayString: '6♣',
        rank: 6,
        suit: 'clubs',
        suitUnicode: '♣',
        baseValue: 5,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/6_of_clubs.png'
        },
        {
        displayString: '7♣',
        rank: 7,
        suit: 'clubs',
        suitUnicode: '♣',
        baseValue: 6,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/7_of_clubs.png'
        },
        {
        displayString: '8♣',
        rank: 8,
        suit: 'clubs',
        suitUnicode: '♣',
        baseValue: 7,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/8_of_clubs.png'
        },
        {
        displayString: '9♣',
        rank: 9,
        suit: 'clubs',
        suitUnicode: '♣',
        baseValue: 8,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/9_of_clubs.png'
        },
        {
        displayString: '10♣',
        rank: 10,
        suit: 'clubs',
        suitUnicode: '♣',
        baseValue: 9,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/10_of_clubs.png'
        },
        {
        displayString: 'J♣',
        rank: 'J',
        suit: 'clubs',
        suitUnicode: '♣',
        baseValue: 10,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/jack_of_clubs2.png'
        },
        {
        displayString: 'Q♣',
        rank: 'Q',
        suit: 'clubs',
        suitUnicode: '♣',
        baseValue: 11,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/queen_of_clubs2.png'
        },
        {
        displayString: 'K♣',
        rank: 'K',
        suit: 'clubs',
        suitUnicode: '♣',
        baseValue: 12,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/king_of_clubs2.png'
        },
        {
        displayString: 'A♣',
        rank: 'A',
        suit: 'clubs',
        suitUnicode: '♣',
        baseValue: 13,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/ace_of_clubs.png'
        },
        {
        displayString: '2♠',
        rank: 2,
        suit: 'diamonds',
        suitUnicode: '♠',
        baseValue: 1,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/2_of_spades.png'
        },
        {
        displayString: '3♠',
        rank: 3,
        suit: 'diamonds',
        suitUnicode: '♠',
        baseValue: 2,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/3_of_spades.png'
        },
        {
        displayString: '4♠',
        rank: 4,
        suit: 'diamonds',
        suitUnicode: '♠',
        baseValue: 3,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/4_of_spades.png'
        },
        {
        displayString: '5♠',
        rank: 5,
        suit: 'diamonds',
        suitUnicode: '♠',
        baseValue: 4,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/5_of_spades.png'
        },
        {
        displayString: '6♠',
        rank: 6,
        suit: 'diamonds',
        suitUnicode: '♠',
        baseValue: 5,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/6_of_spades.png'
        },
        {
        displayString: '7♠',
        rank: 7,
        suit: 'diamonds',
        suitUnicode: '♠',
        baseValue: 6,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/7_of_spades.png'
        },
        {
        displayString: '8♠',
        rank: 8,
        suit: 'diamonds',
        suitUnicode: '♠',
        baseValue: 7,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/8_of_spades.png'
        },
        {
        displayString: '9♠',
        rank: 9,
        suit: 'diamonds',
        suitUnicode: '♠',
        baseValue: 8,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/9_of_spades.png'
        },
        {
        displayString: '10♠',
        rank: 10,
        suit: 'diamonds',
        suitUnicode: '♠',
        baseValue: 9,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/10_of_spades.png'
        },
        {
        displayString: 'J♠',
        rank: 'J',
        suit: 'diamonds',
        suitUnicode: '♠',
        baseValue: 10,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/jack_of_spades2.png'
        },
        {
        displayString: 'Q♠',
        rank: 'Q',
        suit: 'diamonds',
        suitUnicode: '♠',
        baseValue: 11,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/queen_of_spades2.png'
        },
        {
        displayString: 'K♠',
        rank: 'K',
        suit: 'diamonds',
        suitUnicode: '♠',
        baseValue: 12,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/king_of_spades2.png'
        },
        {
        displayString: 'A♠',
        rank: 'A',
        suit: 'diamonds',
        suitUnicode: '♠',
        baseValue: 13,
        suitId: 1,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/ace_of_spades.png'
        },
        {
        displayString: '2♥',
        rank: 2,
        suit: 'clubs',
        suitUnicode: '♥',
        baseValue: 1,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/2_of_hearts.png'
        },
        {
        displayString: '3♥',
        rank: 3,
        suit: 'clubs',
        suitUnicode: '♥',
        baseValue: 2,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/3_of_hearts.png'
        },
        {
        displayString: '4♥',
        rank: 4,
        suit: 'clubs',
        suitUnicode: '♥',
        baseValue: 3,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/4_of_hearts.png'
        },
        {
        displayString: '5♥',
        rank: 5,
        suit: 'clubs',
        suitUnicode: '♥',
        baseValue: 4,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/5_of_hearts.png'
        },
        {
        displayString: '6♥',
        rank: 6,
        suit: 'clubs',
        suitUnicode: '♥',
        baseValue: 5,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/6_of_hearts.png'
        },
        {
        displayString: '7♥',
        rank: 7,
        suit: 'clubs',
        suitUnicode: '♥',
        baseValue: 6,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/7_of_hearts.png'
        },
        {
        displayString: '8♥',
        rank: 8,
        suit: 'clubs',
        suitUnicode: '♥',
        baseValue: 7,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/8_of_hearts.png'
        },
        {
        displayString: '9♥',
        rank: 9,
        suit: 'clubs',
        suitUnicode: '♥',
        baseValue: 8,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/9_of_hearts.png'
        },
        {
        displayString: '10♥',
        rank: 10,
        suit: 'clubs',
        suitUnicode: '♥',
        baseValue: 9,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/10_of_hearts.png'
        },
        {
        displayString: 'J♥',
        rank: 'J',
        suit: 'clubs',
        suitUnicode: '♥',
        baseValue: 10,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/jack_of_hearts2.png'
        },
        {
        displayString: 'Q♥',
        rank: 'Q',
        suit: 'clubs',
        suitUnicode: '♥',
        baseValue: 11,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/queen_of_hearts2.png'
        },
        {
        displayString: 'K♥',
        rank: 'K',
        suit: 'clubs',
        suitUnicode: '♥',
        baseValue: 12,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/king_of_hearts2.png'
        },
        {
        displayString: 'A♥',
        rank: 'A',
        suit: 'clubs',
        suitUnicode: '♥',
        baseValue: 13,
        suitId: 2,
        roundId: 0,
        faceDownImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/949-9499603_ultimate-deck-playing-cards-showcases-great-works-of.png',
        faceUpImageURL: 'https://oh-hell.s3.us-east-2.amazonaws.com/ace_of_hearts.png'
        }
    ]