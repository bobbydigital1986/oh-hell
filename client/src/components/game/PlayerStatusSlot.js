import React, { useState } from "react"

const PlayerStatusSlot = ({ user, gameInfo, gameStarted, phaseOver, round, player, whosTurn, betSubmitter, nextGamePhase, handleStart, playerBetScore, sumOfCurrentBets }) => {
    
    const [input, setInput] = useState(null)

    let betOptions = []
    for (let i = 0; i <= round?.numberOfTricks; i++) {
        let option = (
            <option id={i} key={i} value={i}>
                {i}
            </option>
        )
        if ((i + sumOfCurrentBets) == round?.numberOfTricks && round?.dealerId == player?.id) {
            // Cannot bet i
        } else {
            betOptions.push(option)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!input || input == 99) {
            alert("Pick a valid bet")
        } else {
            betSubmitter(input)
        }
    }

    const handleInputChange = (event) => {
        setInput(event.target.value)
    }

    let statusDisplay = <div></div>
    if (gameInfo && player) {
        if (!gameStarted && gameInfo.ownerId == user.id && gameInfo?.ownerId == player?.id) {
            statusDisplay = (<button type="button" className="button cell start-button" onClick={handleStart}>Start Game</button>)
        } else if (round?.phase == "betting") {
            if (player?.id == user.id && player?.id == whosTurn) {
                statusDisplay = (
                    <div className="betting-player">
                        <form onSubmit={handleSubmit}>
                            <label>
                            Your Bet:
                            <select name="bet" onChange={handleInputChange} defaultValue={99}>
                                <option id={50} key={user.id} value={99} disabled="disabled" selected="selected"> 
                                        --
                                </option>
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
                        <p>{player.username} is betting...</p>
                    </div>
                )
            } else if (player.id == playerBetScore?.userId) {
                statusDisplay = (
                    <div className="betted">
                        <p>{player.username} bet {playerBetScore.bet}</p>
                    </div>
                )
            }
                
        } else if (phaseOver.winnerId == player?.id && player) {
            if (phaseOver.whatsOver == "game") {
                    statusDisplay = (
                        <div className="winner" onClick={nextGamePhase}>
                            <h5>{player?.username} Won the trick! Game Over!</h5>
                            <p>Click to see game recap</p>
                        </div>
                    )
            } else if (phaseOver.whatsOver == "round") {
                //Trick and Round over
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
            statusDisplay = (
                <div className="your-turn">
                    <h4 >{player?.username}'s turn</h4>
                </div>
            )
        }
    }






    return (
        <>
            {statusDisplay}
        </>
    )
}

export default PlayerStatusSlot