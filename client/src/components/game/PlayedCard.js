import React from "react";

const PlayedCard = ({ card, playCard, user }) => {
    // console.log("PlayedCard", card)
    

    return (
        <div className="playing-card">
            <img src={card.faceUpImageURL} />
        </div>
    )

}

export default PlayedCard