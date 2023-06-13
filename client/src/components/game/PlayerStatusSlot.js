import React, { useState } from "react"

const PlayerStatusSlot = ({ user, gameInfo, gameStarted, phaseOver, round, player, whosTurn, betSubmitter, nextGamePhase, handleStart, playerBetScore }) => {
    
    const [input, setInput] = useState(0)

    let betOptions = []
    for (let i = 0; i <= round?.numberOfTricks; i++) {
        let option = (
            <option id={i} key={i} value={i}>
                {i}
            </option>
        )
        betOptions.push(option)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        betSubmitter(input)
    }

    console.log(input)
    const handleInputChange = (event) => {
        setInput(event.target.value)
    }

    let statusDisplay = <div></div>
    // console.log("PlayerTile trickOver", trickOver)
    // console.log("PlayerTile roundOver", roundOver)
    console.log("PlayerStatusSlot PlayerBetScore", playerBetScore)
    if (gameInfo && player) {
        if (!gameStarted && gameInfo.ownerId == user.id && gameInfo?.ownerId == player?.id) {
            statusDisplay = (<button type="button" className="button cell start-button" onClick={handleStart}>Start Game</button>)
        } else if (round?.phase == "betting") {
            console.log("entered round?.phase == betting if statement player", player)
            if (player?.id == user.id && player?.id == whosTurn) {
                statusDisplay = (
                    <div className="betting">
                        <form onSubmit={handleSubmit}>
                            <label>
                            Your Bet:
                            <select name="bet" onChange={handleInputChange}>
                                {betOptions}
                            </select>
                            </label>
                            <div className="button-group">
                                <input className="button" type="submit" value="Submit" />
                            </div>
                        </form>
                    </div>
                )
            } else if (player.id == whosTurn) {
                statusDisplay = (
                    <div className="betting">
                        {player.username} is betting...
                    </div>
                )
            } else if (player.id == playerBetScore?.userId) {
                statusDisplay = (
                    <div className="betted">
                        {player.username} bet {playerBetScore.bet}
                    </div>
                )
            }
                
        } else if (phaseOver.winnerId == player?.id && player) {
            console.log("Missed the betting ifs winner found")
            if (phaseOver.whatsOver == "game") {
                    statusDisplay = (
                        <div className="winner" onClick={nextGamePhase}>
                            <h5>{player?.username} Won the trick! Game Over!</h5>
                            <p>Click to see game recap</p>
                        </div>
                    )
            } else if (phaseOver.whatsOver == "round") {
                //Trick and Round over
                console.log("Game Tile caught the roundOver if")
                statusDisplay = (
                    <div className="winner" onClick={nextGamePhase}>
                        <p>{player?.username} Won!</p>
                        <p>Click for next round</p>
                    </div>
                )
    
            } else {
                //Trick over
                statusDisplay = (
                    <div className="winner" onClick={nextGamePhase}>
                        <h5>{player?.username} Won!</h5>
                        <p>Click for next trick</p>
                    </div>
                )
            }
        } else if (whosTurn == player?.id && whosTurn) {
            console.log("missed the betting ifs -> round.phase", round)
            statusDisplay = (
                <h4 className="your-turn">{player?.username}'s turn</h4>
            )
            // console.log("designated next turn")
        }
    }






    return (
        <>
            {statusDisplay}
        </>
    )
}

export default PlayerStatusSlot