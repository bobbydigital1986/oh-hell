import React from "react";

const PlayerCard = ({ card, playCard, user, canPlay, firstCard }) => {
    // console.log("PlayerCard card", card)
    


    const handleClick = (event) => {
        if (!canPlay) {
            alert("Follow lead suit...or it's not your turn lol")
        } else {
            playCard(card)
        }
    }
    let firstcardstyler
    firstCard ? firstcardstyler = "small-2 card-box first-card" : firstcardstyler = "small-2 card-box"

    let cardController = (
        <div className={firstcardstyler} onClick={handleClick}>
            <div className="cmon grid-x align-spaced playing-card">
                <div className="cell small-4 align-self-top"><p className="card-label">{card.displayString}</p></div>
                <div className="cell small-2 align-self-middle"><div></div></div>
                <div className="cell small-4 align-self-bottom"><p className="card-label">{card.displayString}</p></div>
            </div>
        </div>
        
    )

    if (card.userId != user.id) {
        cardController = (
            <div className={`${firstcardstyler} playing-card other-players-card`}>
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