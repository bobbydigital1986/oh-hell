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
        <div className="welcome-page">
            <h1>Welcome to Oh Hell</h1>
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
    )
}

export default WelcomePage