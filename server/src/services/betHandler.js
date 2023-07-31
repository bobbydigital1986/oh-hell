import { BetScore, Registration, Round } from "../models/index.js"

const betHandler = async(bet, round, game, user) => {

    const registrant = await Registration.query().findOne({ gameId: game.id, userId: user.id })
    let newBet = await BetScore.query().insertAndFetch({ bet, registrantId: registrant.id, roundId: round.id, userId: user.id})
    
    let updatedRound
    const userIdInteger = parseInt(user.id)

    let bettingUsersDealerIndex = game.dealerOrder.indexOf(userIdInteger)
    let whosTurnToBet = game.dealerOrder[bettingUsersDealerIndex + 1]
    if (!whosTurnToBet) {
        whosTurnToBet = game.dealerOrder[0]
    }

    let allRoundBets = await Round.relatedQuery("betScores").for(round.id)
    const sumOfCurrentBets = allRoundBets.reduce((accumulator, nextBet) => accumulator + nextBet.bet, 0)
    if (sumOfCurrentBets == round.numberOfTricks && user.id == round.dealerId) {
        console.log("BET WAS INVALID -- UNDOING EVERYTHING")
        await BetScore.query().deleteById(newBet.id)
        allRoundBets = await Round.relatedQuery("betScores").for(round.id)
        let undoneBetResponse = {
            bets: allRoundBets,
            game: game,
            round: round,
            user: user,
            badBetMessage: "Somehow a bad bet got through - bet was annulled and player bets again"
        }
        return undoneBetResponse 

    } else if (game.numberOfPlayers <= allRoundBets.length) {
        updatedRound = await Round.query().patchAndFetchById(round.id, {
            whosTurn: whosTurnToBet,
            phase: "playing"
        })
        
    } else {
        updatedRound = await Round.query().patchAndFetchById(round.id, { whosTurn: whosTurnToBet })
    }
    
    let betResponse = {
        bets: allRoundBets,
        game: game,
        round: Round.roundSerializer(updatedRound),
        user: user
    }

    return betResponse

}

export default betHandler