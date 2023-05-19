import React, { useState, useEffect } from "react";

const PlayerTile = ({ player, dealtCards }) => {

    let slotName
    let slotStyle
    if (player) {
        slotName = `${player.username}'s`
    } else {
        slotName = 'Open '
        slotStyle = "open-slot"
    }
    console.log("in player tile", dealtCards)
    return (
        <>
            <div className={`cell small-6 player-tile ${slotStyle}`}>
                <div className="grid-x">
                    <h1 className="cell small-10"> {slotName} Slot </h1>
                    <h6 className="cell small-2 played-card"> Played Card </h6>
                </div>
                <div>
                    {dealtCards?.displayString}
                </div>
            </div>
        </>
    )

}

export default PlayerTile