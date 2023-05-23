import React from "react";

const PlayedCard = ({ card, playCard, user }) => {
    // console.log("PlayedCard", card)
    

    return (
        <div className="playing-card grid-x align-spaced played-card">
                <div className="cell small-4 align-self-top"><div>{card.displayString}</div></div>
                <div className="cell small-2 align-self-middle"><div></div></div>
                <div className="cell small-4 align-self-bottom"><div>{card.displayString}</div></div>
        </div>
    )

}

export default PlayedCard