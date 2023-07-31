import { Registration, Game } from "../models/index.js";

const joinGame = async(game, userId) => {
        const existingRegistrants = await Registration.query().where('gameId', game.id)
        if (existingRegistrants.find(player => player.userId == userId)) {
                console.log("EXISTING REGISTRATION FOUND")
        } else {
                await Registration.query().insert({ userId: userId, gameId: game.id })
                if (existingRegistrants.length + 1 >= game.numberOfPlayers) {
                        await Game.query().patchAndFetchById(game.id, { acceptingRegistrants: false })
                }
        }
}

        



export default joinGame