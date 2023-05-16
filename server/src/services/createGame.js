import { Game, User, Registration } from "../models/index.js"

const createGame = async(user) => {
    console.log("in createGame")
    const findGame = await Game.query().findOne('acceptingRegistrants', 'true')
    // console.log("findGame", findGame)
    if (!findGame) {
        const newGame = await Game.query().insertAndFetch({ ownerId: user.user.id })
        relateRegistrants(newGame, user)
        return { newGame }
    } else {
        relateRegistrants(findGame, user)
        return { findGame }
    }
}

const relateRegistrants = async(game, user) => {
    console.log("relatedRegistrants", game)
    await game.$relatedQuery("registrants").relate(await User.query().findById(user.user.id))
    const numberRegistrants = await Registration.query().where('gameId', game.id)
    if (numberRegistrants >= game.numberOfPlayer) {
        await game.$patch({ acceptingRegistrants: false })
    }
    return
}

export default createGame