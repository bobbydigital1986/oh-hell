import React, { useState, useEffect } from "react";
import PlayerCard from "./PlayerCard";

const PlayerTile = ({ player, dealtCards, playCard }) => {

    let slotName
    let slotStyle
    if (player) {
        slotName = `${player.username}'s`
    } else {
        slotName = 'Open '
        slotStyle = "open-slot"
    }
    console.log("in player tile dealt cards", dealtCards)
    let cardsArray
    if (dealtCards) {
        cardsArray = dealtCards.map((card => {
            return (
                <PlayerCard
                    key={card.id}
                    card={card}
                    playCard={playCard}
                />
            )
        }))
    }

    return (
        <>
            <div className={`cell small-6 player-tile ${slotStyle}`}>
                <div className="grid-x">
                    <h1 className="cell small-10"> {slotName} Slot </h1>
                    <h6 className="cell small-2 played-card"> Played Card </h6>
                </div>
                {/* <div className="card-space"> */}
                    {cardsArray}
                {/* </div> */}
            </div>
        </>
    )

}

export default PlayerTile