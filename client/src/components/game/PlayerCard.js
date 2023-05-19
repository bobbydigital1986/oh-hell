import React from "react";

const PlayerCard = ({ card, playCard }) => {
    console.log("PlayerCard", card)

    const handleClick = (event) => {
        playCard(card)
    }

    return (
        <div className="playing-card" onClick={handleClick}>
            <div className="cmon grid-x align-spaced">
                <div className="cell small-4 align-self-top"><div>{card.displayString}</div></div>
                <div className="cell small-2 align-self-middle"><div></div></div>
                <div className="cell small-4 align-self-bottom"><div>{card.displayString}</div></div>
            </div>
        </div>
    )

}

export default PlayerCard