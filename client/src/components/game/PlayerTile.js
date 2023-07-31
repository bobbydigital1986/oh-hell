import React, { useState, useEffect } from "react";
import PlayerCard from "./PlayerCard";
import PlayedCard from "./PlayedCard"
import PlayerStatusSlot from "./PlayerStatusSlot";

const PlayerTile = ({
    user,
    player,
    gameInfo,
    tileDealtCards,
    playCard,
    playedCards,
    round,
    whosTurn,
    leadSuit,
    nextGamePhase,
    phaseOver,
    betSubmitter,
    betScores,
    gameStarted,
    handleStart,
    playerBetScore,
    sumOfCurrentBets
}) => {

    let slotName
    let slotStyle
    let dealer
    if (player) {
        slotName = `${player.username}`
        if (round.dealerId == player.id) {
            dealer = "Dealer"
        }
    } else {
        slotName = 'Open '
        slotStyle = "open-slot"
    }
    
    let cardsArray
    let playedCardSlot = (
        "Played Card Slot"
    )
    if (tileDealtCards) {
        let noLeadSuitInHand
        if (!leadSuit?.suitId) {
            noLeadSuitInHand = true
        } else if (tileDealtCards.find(cardSuit => cardSuit.suitId == leadSuit.suitId)) {
            noLeadSuitInHand = false
        } else {
            noLeadSuitInHand = true
        }
        
        let cardCount = 0
        let firstCard
        cardsArray = tileDealtCards.map((card => {
            let canPlay = false
            if (whosTurn != player.id) {
                canPlay = false
            } else if (noLeadSuitInHand === true || card.suitId === leadSuit.suitId) {
                canPlay = true
            } 
            if (!playedCards.find(playedCard => card.id === playedCard.id)) {
                cardCount === 0 ? firstCard = true : firstCard = false
                cardCount++
                return (
                    <PlayerCard
                        key={card.id}
                        card={card}
                        playCard={playCard}
                        user={user}
                        canPlay={canPlay}
                        firstCard={firstCard}
                    />
                )
            } else {
                playedCardSlot = (
                    <PlayedCard
                        key={card.id}
                        card={card}
                        playCard={playCard}
                        user={user}
                        canPlay={false}
                        betScores={betScores}
                        betSubmitter={betSubmitter}
                    />
                )
            }
        }))
    }

    return (
        <>
            <div className={`cell small-6 player-tile ${slotStyle}`}>
                <div className="grid-x player-tile-top-slots">
                    <div className="cell small-4">
                        <h2 > {slotName} </h2>
                        <p className="dealer-indicator">{dealer}</p>
                    </div>
                    <div className="cell small-4">
                        <PlayerStatusSlot
                            user={user}
                            phaseOver={phaseOver}
                            player={player}
                            whosTurn={whosTurn}
                            round={round}
                            nextGamePhase={nextGamePhase}
                            gameInfo={gameInfo}
                            gameStarted={gameStarted}
                            handleStart={handleStart}
                            betSubmitter={betSubmitter}
                            playerBetScore={playerBetScore}
                            sumOfCurrentBets={sumOfCurrentBets}
                        />
                    </div>
                    <div className="cell small-4 played-card-slot"> 
                        {playedCardSlot}
                    </div>
                </div>
                <div className="grid-x">
                    {cardsArray}
                </div>
            </div>
        </>
    )

}

export default PlayerTile