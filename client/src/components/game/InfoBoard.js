import React from "react";

const InfoBoard = ({ trump, players, round, gameInfo, dealerId, leadSuit }) => {
    console.log("leadSuit", leadSuit)
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
                <li>Trump: {trump?.suitUnicode}{trump?.suit}{trump?.suitUnicode}</li>
                <li>LeadSuit: {leadSuit?.suitUnicode}{leadSuit?.suit}{leadSuit?.suitUnicode}</li>
                <li>Players: {playerNames.join(", ")}</li>
                <li>Round: {round?.numberOfTricks}</li>
                <li>Dealer: {dealerName}</li>
            </ul>

        </div>
    )

}

export default InfoBoard