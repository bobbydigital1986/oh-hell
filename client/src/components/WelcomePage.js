import React from "react";
import { Link } from "react-router-dom";

const WelcomePage = (props) => {

    return (
        <>
            <h1>Welcome to Oh Hell</h1>
            <Link to="/game/new" type="button">Join A Game</Link>
        </>
    )
}

export default WelcomePage