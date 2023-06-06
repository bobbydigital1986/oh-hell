import React from "react";

const InfoBoard = ({ trump, players, round, gameInfo, dealerId, leadSuit, betScores }) => {
    console.log("leadSuit", leadSuit)
    console.log("Trump", trump)
    console.log("Round", round)
    console.log("gameinfo board players", players)

    const playerNames = players.map(player => {
        return player.username
    })

    let dealerName
    if (dealerId) {
        let dealer = players.find(player => player.id == dealerId)
        dealerName = dealer.username
        
    }
    let scoreTable = []
    if (players) {
        
        for (let player of players) {
            
            let playerBet = {
                bet: "-",
                tricksWon: "-"
            }
            console.log("betScores", betScores)
            if (betScores && betScores.length > 0) {
                let findBet = betScores.find(bet => bet.userId == player.id)
                if (findBet) {
                    playerBet = findBet
                }
            }
            console.log("playerBet", playerBet)
            scoreTable.push(
                <tr key={player.id}>
                    <td>{player.username}</td>
                    <td>{playerBet.bet}</td>
                    <td>{playerBet.tricksWon}</td>
                    <td>{player.gameScore}</td>
                </tr>
            )
        }
    }
    

    // return (
    //     <div className="cell small-4 game-info">
    //         <h4>Info</h4>
    //         <ul>
    //             <li>Trump: {trump?.suitUnicode}{trump?.suit}{trump?.suitUnicode}</li>
    //             <li>LeadSuit: {leadSuit?.suitUnicode}{leadSuit?.suit}{leadSuit?.suitUnicode}</li>
    //             <li>Players: {playerNames.join(", ")}</li>
    //             <li>Round: {round?.numberOfTricks}</li>
    //             <li>Dealer: {dealerName}</li>
    //         </ul>

    //     </div>
    // )
    return (
        <div className="cell small-4 game-info">
            <ul className="no-bullet ">
                <li>Round: {round?.numberOfTricks}</li>
                <li>Dealer: {dealerName}</li>
                <li>Trump: {trump?.suitUnicode}{trump?.suit}{trump?.suitUnicode}</li>
                <li>LeadSuit: {leadSuit?.suitUnicode}{leadSuit?.suit}{leadSuit?.suitUnicode}</li>
                </ul>
            <div className="table-scroll">
                <table className="score-table">
                    <thead>
                        <tr>
                        <th>GAME SCORE</th>
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