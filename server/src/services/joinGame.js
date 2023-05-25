import { Registration, Game } from "../models/index.js";

const joinGame = async(game, userId) => {

        // console.log("relateRegistrants userId", userId)
        // console.log("relateRegistrants userId", game)


        const existingRegistrants = await Registration.query().where('gameId', game.id)
        // console.log(existingRegistrants)
        // console.log("find query", existingRegistrants.find(player => player.userId == userId))

        if (existingRegistrants.find(player => player.userId == userId)) {
                console.log("found the guy")
        } else {
                console.log("missed the if")
                await Registration.query().insert({ userId: userId, gameId: game.id })
                if (existingRegistrants.length + 1 >= game.numberOfPlayers) {
                        await Game.query().patchAndFetchById(game.id, { acceptingRegistrants: false })
                }
        }
}

        



export default joinGame