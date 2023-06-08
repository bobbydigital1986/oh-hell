import { Game, User, Registration } from "../models/index.js"

const createGame = async(user, numberOfPlayers, numberOfRounds, gameCreate) => {
    if (gameCreate) {
        const newGame = await Game.query().insertAndFetch({ ownerId: user.id, numberOfPlayers, numberOfRounds })
        return { newGame }

    } else {
        const findGame = await Game.query().findOne({ acceptingRegistrants: true })
        if (findGame) {
            return { findGame }
        }
        else {
            const newGame = await Game.query().insertAndFetch({ ownerId: user.id, numberOfPlayers, numberOfRounds })
            return { newGame }
        }
    }
}

export default createGame