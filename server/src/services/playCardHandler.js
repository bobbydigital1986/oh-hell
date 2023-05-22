import { Game, Round, Trick, Card } from "../models/index.js"


const playCardHandler = async(game, round, trick, card) => {
    
    let playCardReponse = {
        trickOver: false,
        roundOver: false,
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
        if (game.dealerOrder.length == 2) {
            playCardReponse.whosTurn = game.dealerOrder[0]
        } else {
            playCardReponse.whosTurn = game.dealerOrder[2]
        }
        return  playCardReponse
    } else {
        //Not first card played in trick, evaluate if trick is over or not
        const leadSuitId = await Card.query().select('suitId').where('trickLeadSuit', trick.id).limit(1)
        console.log("playCard leadSuitId:", leadSuitId)
        let cardPlayedWithTrick = await Card.query().patchAndFetchById(card.id, { trickPlayedId: trick.id })
        if (cardPlayedWithTrick.suitId === leadSuitId) {
            //check if card played was lead suit and designate it as such in db
            cardPlayedWithTrick = await Card.query().patchAndFetchById(card.id, { trickLeadSuit: trick.id })
        }
        playCardReponse.playedCards = [...cardsPlayedPreviously, cardPlayedWithTrick]
        const cardPlayersSpotInRotation = game.dealerOrder.indexOf(cardPlayedWithTrick.userId)
        
        if (cardsPlayedPreviously.length + 1 == game.numberOfPlayers) {
            //Trick is over, evaluate winner & evaluate if round is over
            console.log("Trick is over, evaluate winner & evaluate if round is over")
            playCardReponse.trickOver = true

            const winner = await Trick.determineTrickWinner(trick)
            console.log("playCard Trick winner", winner)
            playCardReponse.winnerId = winner.userId
            const tricksPlayedSoFar = await Trick.query().where('roundId', round.id)
            if (tricksPlayedSoFar < round.numberOfTricks) {
                //Round not over
                console.log("play card resolved as trick over only")
                // const newTrick = await Trick.trickBuilder(round)
                playCardReponse.newTrick = newTrick 
                playCardReponse.whosTurn = winner.userId //Winner plays first in next trick
                return playCardReponse
            } else {
                console.log("Play card round over")
                playCardReponse.roundOver = true
                return playCardReponse

                //Round over - send off to build new Round, then create new trick with new Round's Id associated

            }
        } else {
            //Trick is not over
            console.log("Trick not over")
            const cardPlayersOrderIndex = game.dealerOrder.indexOf(card.userId)
            playCardReponse.whosTurn = game.dealerOrder[cardPlayersOrderIndex + 1]
            return playCardReponse
        }
    }
        // playCardReponse = {
        //     trickOver: false,
        //     roundOver: false,
        //     winnerId: userId,
        //     playedCards: [playedCards]
        //     whosTurn: userId
        //     newTrick: newTrick
        //     newRound: newRound
        // }




}

export default playCardHandler