import React from "react";

const PlayedCard = ({ card }) => {    

    return (
        <div className="playing-card">
            <img src={card?.faceUpImageURL} />
        </div>
    )

}

export default PlayedCard