import React from "react";

const InfoBoard = ({ trump, players, round, gameInfo, dealerId, leadSuit, betScores, phaseOver }) => {

    let dealerName
    if (dealerId) {
        let dealer = players.find(player => player.id == dealerId)
        dealerName = dealer.username
        
    }
    let scoreTable = []
    let winStyling = ""
    let winCheck
    let playerRow = 0
    if (players) {
        
        for (let player of players) {
            playerRow++
            let playerBet = {
                bet: "-",
                tricksWon: "-"
            }
            if (betScores && betScores.length > 0) {
                let findBet = betScores.find(bet => bet.userId == player.id)
                if (findBet) {
                    playerBet = findBet
                    
                    if (phaseOver.whatsOver == "round" || phaseOver.whatsOver == "game" ) {
                        if (playerBet.bet == playerBet.tricksWon && playerBet.bet != "-") {
                            winStyling = "winner-styling"
                            winCheck = "✔"
                        } else {
                            winStyling = ""
                            winCheck = ""
                        }
                    }
                }
            }
            
            scoreTable.push(
                <tr key={player.id} className={winStyling}>
                    <td>{player.username}</td>
                    <td>{playerBet.bet} {winCheck}</td>
                    <td>{playerBet.tricksWon}</td>
                    <td>{player.gameScore}</td>
                </tr>
            )
        }
    }
    
    return (
        <div className="cell small-6 game-info">
            <h5 className="centered">Game Info</h5>
            <ul className="no-bullet info-list">
                <li>Round: {round?.numberOfTricks}</li>
                <li>Dealer: {dealerName}</li>
                <li>Trump: {trump?.suitUnicode}{trump?.suit}{trump?.suitUnicode}</li>
                <li>LeadSuit: {leadSuit?.suitUnicode}{leadSuit?.suit}{leadSuit?.suitUnicode}</li>
                </ul>
            <div className="table-scroll">
                <table className="score-table">
                    <thead>
                        <tr>
                        <th>SCORES</th>
                        <th>Bet</th>
                        <th>Won</th>
                        <th>Overall</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scoreTable}
                    </tbody>
                </table>
            </div>

        </div>
    )

}

export default InfoBoard