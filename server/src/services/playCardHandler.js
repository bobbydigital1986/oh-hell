import { Game, Round, Trick, Card } from "../models/index.js"


const playCardHandler = async(game, round, trick, card) => {
    
    let playCardReponse = {
        gameOver: {
            whatsOver: "", // trick, round, game
            winnerId: null
        },
        playedCards: []
    }
    console.log("playCard game", game)
    console.log("playCard round", round)
    console.log("playCard trick", trick)
    console.log("playCard card", card)

    const cardsPlayedPreviously = await Card.query().where('trickPlayedId', trick.id)
    console.log("playCard cardsPlayedPreviously query", cardsPlayedPreviously)
    if (cardsPlayedPreviously.length == 0) {
        //First card played in trick - set leadSuit
        const playedCard = await Card.query().patchAndFetchById(card.id, { trickPlayedId: trick.id, trickLeadSuit: trick.id })
        console.log("playCard playedCard query", playedCard)

        playCardReponse.playedCards = [...cardsPlayedPreviously, playedCard]
        playCardReponse.leadSuit = playedCard

        console.log("playCard playedCard query two secs later", playedCard)
        console.log("game.dealerOrder", game.dealerOrder)
        console.log("playedCard.userId")
        const playedCardUsersOrderIndex = game.dealerOrder.indexOf(playedCard.userId)
        console.log("playedCardUsersOrderIndex", playedCardUsersOrderIndex)
        let whosUpIndex = playedCardUsersOrderIndex + 1
        console.log("whosUpIndex", whosUpIndex)
        if (!game.dealerOrder[whosUpIndex]) {
            console.log("hit the whosUp if statement, should be set to 0")
            whosUpIndex = 0
        }
        playCardReponse.whosTurn = game.dealerOrder[whosUpIndex]
        
        return  playCardReponse
    } else {
        //Not first card played in trick, evaluate if trick is over or not
        const ledCard = await Card.query()
            .select('suitId')
            .findOne({ trickLeadSuit: trick.id })
        const leadSuitId = ledCard.suitId
        console.log("playCard leadSuitId:", leadSuitId)
        let cardPlayedWithTrick
        console.log("playCardHandler cardPlayedWithTrick", cardPlayedWithTrick)
        //check if card played was lead suit and designate it as such in db
        if (card.suitId == leadSuitId) {
            //card matched lead suit
            cardPlayedWithTrick = await Card.query().patchAndFetchById(card.id, { trickPlayedId: trick.id, trickLeadSuit: trick.id })
        } else {
            //card did not match lead suit
            cardPlayedWithTrick = await Card.query().patchAndFetchById(card.id, { trickPlayedId: trick.id })
        }
        playCardReponse.playedCards = [...cardsPlayedPreviously, cardPlayedWithTrick]
        const cardPlayersSpotInRotation = game.dealerOrder.indexOf(cardPlayedWithTrick.userId)
        
        
        if (cardsPlayedPreviously.length + 1 == game.numberOfPlayers) {
            //Trick is over, evaluate winner & evaluate if round is over
            console.log("Trick is over, evaluate winner & evaluate if round is over")
            playCardReponse.gameOver.whatsOver = "trick"

            const winner = await Trick.determineTrickWinner(trick)
            console.log("playCard Trick winner", winner)
            // playCardReponse.winnerId = winner.userId
            playCardReponse.gameOver.winnerId = winner.userId

            const tricksPlayedSoFar = await Trick.query().where('roundId', round.id)
            console.log("tricksPlayedSoFar", )
            if (tricksPlayedSoFar.length < round.numberOfTricks) {
                //Round not over
                console.log("play card resolved as trick over only")
                // const newTrick = await Trick.trickBuilder(round)
                // playCardReponse.newTrick = newTrick 
                playCardReponse.whosTurn = winner.userId //Winner plays first in next trick
                return playCardReponse
            } else {
                //Round over
                console.log("Play card round over")
                // playCardReponse.roundOver = true
                playCardReponse.gameOver.whatsOver = "round"

                return playCardReponse


            }
        } else {
            //Trick is not over
            console.log("Trick not over")
            const playedCardUsersOrderIndex = game.dealerOrder.indexOfplayedCard.userId
            let whosUpIndex = playedCardUsersOrderIndex + 1
            if (!game.dealerOrder[whosUpIndex]) {
                whosUpIndex = 0
            }
            playCardReponse.whosTurn = game.dealerOrder[whosUpIndex]
            
            return playCardReponse
        }
    }
        // playCardReponse = {
        //     gameOver: {
        //         whatsOver: trick or round or game,
        //         winnerId: 1
        //     }, 
        //     winnerId: userId,
        //     playedCards: [playedCards],
        //     whosTurn: userId,
        //     leadSuit: leadSuit
        // }




}

export default playCardHandler