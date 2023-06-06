import { BetScore, Registration, Round } from "../models/index.js"

const betHandler = async(bet, round, game, user) => {
    console.log("betHandler bet", bet)
    console.log("betHandler round", round)
    console.log("betHandler game", game)
    console.log("betHandler user", user)
    const registrant = await Registration.query().findOne({ gameId: game.id, userId: user.id })
    console.log("betHandler registrantId", registrant)
    let newBet = await BetScore.query().insertAndFetch({ bet, registrantId: registrant.id, roundId: round.id, userId: user.id})
    console.log("betHandler newBet", newBet)
    
    // let newBet = await BetScore.query().insertAndFetch({
    //     roundId: round.id,
    //     registrantId: registrantId,
    //     bet: bet,
    //     userId: user.id
    // })
    
    let updatedRound
    const userIdInteger = parseInt(user.id)
    console.log("userIdInteger", userIdInteger)

    let bettingUsersDealerIndex = game.dealerOrder.indexOf(userIdInteger)
    console.log("bettingUsersDealerIndex", bettingUsersDealerIndex)
    let whosTurnToBet = game.dealerOrder[bettingUsersDealerIndex + 1]
    if (!whosTurnToBet) {
        whosTurnToBet = game.dealerOrder[0]
    }
    // console.log("whosTurnToBetMaybeString", whosTurnToBetMaybeString)
    // let whosTurnToBet = parseInt(whosTurnToBetMaybeString)
    console.log("whosTurnToBet", whosTurnToBet)
    const allBets = await Round.relatedQuery("betScores").for(round.id)
    console.log("betHandler allBets related query", allBets)
    if (game.numberOfPlayers <= allBets.length) {
        console.log("ALL BETS HAVE BEEN MADE, UPDATE ROUND PHASE")
        console.log("game.numberOfPlayers", game.numberOfPlayers)
        console.log("allBets", allBets)
        updatedRound = await Round.query().patchAndFetchById(round.id, {
            whosTurn: whosTurnToBet,
            phase: "playing"
        })
    } else {
        console.log("MORE BETS TO MADE, RESUME BETTING PHASE")
        console.log("game.numberOfPlayers", game.numberOfPlayers)
        console.log("allBets", allBets)
        updatedRound = await Round.query().patchAndFetchById(round.id, { whosTurn: whosTurnToBet })
    }
    console.log(" betHandler updatedRound", updatedRound)
    
    let betResponse = {
        bets: allBets,
        game: game,
        round: Round.roundSerializer(updatedRound),
        user: user
    }

    return betResponse

}

export default betHandler