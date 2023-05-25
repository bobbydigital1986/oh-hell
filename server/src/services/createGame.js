import { Game, User, Registration } from "../models/index.js"

const createGame = async(user, numberOfPlayers, numberOfRounds) => {
    console.log("in createGame")
    const findGame = await Game.query().findOne({ acceptingRegistrants: true })
    console.log("createGame", user)
    if (!findGame) {
        const newGame = await Game.query().insertAndFetch({ ownerId: user.id, numberOfPlayers, numberOfRounds })
        return { newGame }
    } else {
        return { findGame }
    }
}

export default createGame