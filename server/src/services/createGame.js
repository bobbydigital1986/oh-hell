import { Game, User, Registration } from "../models/index.js"

const createGame = async(user) => {
    console.log("in createGame")
    const findGame = await Game.query().findOne('acceptingRegistrants', 'true')
    console.log("createGame", user)
    if (!findGame) {
        const newGame = await Game.query().insertAndFetch({ ownerId: user.id })
        // relateRegistrants(newGame)
        return { newGame }
    } else {
        // relateRegistrants(findGame)
        return { findGame }
    }
}

export default createGame