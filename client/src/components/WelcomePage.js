import React from "react";
import { Link } from "react-router-dom";

const WelcomePage = () => {

    return (
        <>
            <h1>Welcome to Oh Hell</h1>
            <Link to="/game" type="button">Start Game</Link>
        </>
    )
}

export default WelcomePage