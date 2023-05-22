import React from "react";

const InfoBoard = ({ trump, players, round, gameInfo, dealerId }) => {

    console.log("Trump", trump)
    console.log("Round", round)

    const playerNames = players.map(player => {
        return player.username
    })

    let dealerName
    if (dealerId) {
        let dealer = players.find(player => player.id == dealerId)
        dealerName = dealer.username
        
    }
    

    return (
        <div className="cell small-4 game-info">
            <h4>Info</h4>
            <ul>
                <li>Players: {playerNames.join(", ")}</li>
                <li>Round: {round?.id}</li>
                <li>Dealer: {dealerName}</li>
                <li>Trump: {trump?.suitUnicode}</li>
            </ul>

        </div>
    )

}

export default InfoBoard