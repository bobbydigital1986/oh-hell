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
        <div className={`${firstcardstyler} playing-card`} onClick={handleClick}>
                <img src={card.faceUpImageURL} />
        </div>
        
    )
    if (card.userId != user.id) {
        cardController = (
            <div className={`${firstcardstyler} playing-card`}>
                <img src={card.faceDownImageURL} />
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