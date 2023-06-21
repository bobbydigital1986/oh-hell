import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

const WelcomePage = (props) => {

    const [gameSettings, setGameSettings] = useState({
        numberOfPlayers: 4,
        numberOfRounds: 3
    })
    const [shouldRedirect, setShouldRedirect] = useState(false)


    let maxNumberOfPlayers = 5
    let numberOfPlayers = []
    for (let i = 1; i <= maxNumberOfPlayers; i++) {
        let option = (
            <option id={i} key={i} value={i}>
                {i}
            </option>
        )
        numberOfPlayers.push(option)
    }

    let maxNumberOfRounds = 12
    let numberOfRounds = []
    for (let i = 1; i <= maxNumberOfRounds; i++) {
        let option = (
            <option id={i} key={i} value={i}>
                {i}
            </option>
        )
        numberOfRounds.push(option)
    }

    console.log("gameSettings", gameSettings)

    const handleInputChange = (event) => {
        console.log("event.currentTarget", event.currentTarget)
        console.log("event.currentTarget.value", event.currentTarget.value)
        console.log("event.currentTarget.name", event.currentTarget.name)
        setGameSettings({
            ...gameSettings,
            [event.currentTarget.name]: event.currentTarget.value
        })
        // }
        console.log("missed both ifs")
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setShouldRedirect(true)
    }

    if (shouldRedirect === true ) {
        console.log("caught the redirect gameSettings", gameSettings)
        return <Redirect to={{
            pathname: "/game/new",
            gameSettings: {
                numberOfPlayers: gameSettings.numberOfPlayers,
                numberOfRounds: gameSettings.numberOfRounds
            }
            }}
        />
    }
    
    


    return (
        <div className="welcome-page grid-x">
            <div className="cell small-10 welcome-section">
                <h1>Welcome to Oh Hell</h1>
                <p className="game-description">Oh Hell is a trick-taking game that can be played with 3 to 7 players, although it's most commonly played with 4 or 5 players. The game follows a bidding process where players predict the number of tricks they will take in each round. It's an entertaining and strategic game that requires players to make accurate predictions and employ tactics to outscore their opponents.</p>
                <Link push to="/howtoplay" className="button">Click here for more details on how to play</Link>
            </div>
            <div className="cell small-10 welcome-section">
                <h1>Get into the Game</h1>
                <form onSubmit={handleSubmit} className="game-configuration">
                    <label>
                        Number of Players:
                        <select name="numberOfPlayers" onChange={handleInputChange} value={gameSettings.numberOfPlayers}>
                            {numberOfPlayers}
                        </select>
                    </label>
                    <label>
                        Number Of Rounds:
                        <select name="numberOfRounds" onChange={handleInputChange} value={gameSettings.numberOfRounds}>
                            {numberOfRounds}
                        </select>
                    </label>
                    <div className="button-group">
                        <input className="button link-button" type="submit" value="Create Game" />
                    </div>
                </form>
                <Link to="/game/new" type="button" className="button link-button">Join An Existing Game</Link>
            </div>
        </div>
    )
}

export default WelcomePage