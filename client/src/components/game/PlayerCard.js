import React from "react";

const PlayerCard = ({ card, playCard, user, canPlay }) => {
    // console.log("PlayerCard card", card)
    


    const handleClick = (event) => {
        if (!canPlay) {
            alert("Follow lead suit...or it's not your turn lol")
        } else {
            playCard(card)
        }
    }
    

    let cardController = (
        <div className="playing-card" onClick={handleClick}>
            <div className="cmon grid-x align-spaced">
                <div className="cell small-4 align-self-top"><div>{card.displayString}</div></div>
                <div className="cell small-2 align-self-middle"><div></div></div>
                <div className="cell small-4 align-self-bottom"><div>{card.displayString}</div></div>
            </div>
        </div>
        
    )

    if (card.userId != user.id) {
        cardController = (
            <div className="playing-card other-players-card">
                <h1 className="cell">?</h1>
            </div>
        )
    }

    return (
        <>
            {cardController}
        </>
    )

}

export default PlayerCard