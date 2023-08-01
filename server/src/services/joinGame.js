import { Registration, Game } from "../models/index.js";

const joinGame = async(game, userId) => {
        const existingRegistrants = await Registration.query().where('gameId', game.id)
        const findExistingPlayer = existingRegistrants.find(player => player.userId == userId)
        if (game.acceptingRegistrants == false && !findExistingPlayer) {
                return 'redirect'
        } else if (findExistingPlayer && game.gameStarted == true) {
                return 'reconnect'
        } else if (game.gameStarted == false && game.acceptingRegistrants == true) {
                //player not found and game not-started but accepting registrants
                if (!findExistingPlayer) {
                        await Registration.query().insert({ userId: userId, gameId: game.id })
                        if (existingRegistrants.length + 1 >= game.numberOfPlayers) {
                                await Game.query().patchAndFetchById(game.id, { acceptingRegistrants: false })
                        }
                }
                const currentPlayers = await Registration.query()
                        .where({ gameId: game.id })
                        .join('users', 'registrations.userId', 'users.id')
                        .select('registrations.userId as id', 'users.username', 'registrations.gameScore')
                return currentPlayers
                
        } else {
                console.log('Missed all the join game ifs')
        }
}

        



export default joinGame