import React, { useState, useEffect } from "react";
import PlayerCard from "./PlayerCard";
import PlayedCard from "./PlayedCard"

const PlayerTile = ({ player, user, dealtCards, playCard, whosTurn, playedCards, leadSuit, trickOver, nextPhase, roundOver }) => {

    let slotName
    let slotStyle
    if (player) {
        slotName = `${player.username}'s`
    } else {
        slotName = 'Open '
        slotStyle = "open-slot"
    }
    // console.log("in player tile dealt cards", dealtCards)
    // console.log("in player tile played cards", playedCards)
    
    let cardsArray
    let playedCardSlot = (
        "Played Card Slot"
    )
    if (dealtCards) {
        let noLeadSuitInHand
        if (!leadSuit) {
            noLeadSuitInHand = true
        } else if (dealtCards.find(cardSuit => cardSuit.suitId == leadSuit)) {
                noLeadSuitInHand = false
        } else {
            noLeadSuitInHand = true
        }
        
        
        cardsArray = dealtCards.map((card => {
            // console.log("playerTile canPlay logic card", card)
            // console.log("playerTile canPlay logic whosTurn", whosTurn)
            // console.log("playerTile canPlay logic leadSuit", leadSuit)
            let canPlay = false
            if (whosTurn != player.id) {
                canPlay = false
            } else if (noLeadSuitInHand === true || card.suitId === leadSuit.id) {
                canPlay = true
            } 
            if (!playedCards.find(playedCard => card.id === playedCard.id)) {
                console.log("playerTile canPlay designation on card", canPlay)
                return (
                    <PlayerCard
                        key={card.id}
                        card={card}
                        playCard={playCard}
                        user={user}
                        canPlay={canPlay}
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
                    />
                )
            }
        }))
    }

    let whosTurnIcon = <div className="cell small-3"></div>
    console.log("PlayerTile trickOver", trickOver)
    console.log("PlayerTile roundOver", roundOver)
    if (trickOver.winnerId == player?.id && player) {
        // console.log("winner found")

        if (roundOver) {
            //Trick and Round over
            console.log("Game Tile caught the roundOver if")
            whosTurnIcon = (
                <div className="cell small-3 winner" onClick={nextPhase}>
                    <h5>{player?.username} Won!</h5>
                    <p>Click for next round</p>
                </div>
            )

        } else {
            //Trick over
            whosTurnIcon = (
                <div className="cell small-3 winner" onClick={nextPhase}>
                    <h5>{player?.username} Won!</h5>
                    <p>Click for next trick</p>
                </div>
            )
        }
    } else if (whosTurn ==
         player?.id) {
        whosTurnIcon = (
            <div className="cell small-3">{player?.username}'s turn</div>
        )
        // console.log("designated next turn")
    }

    return (
        <>
            <div className={`cell small-6 player-tile ${slotStyle}`}>
                <div className="grid-x">
                    <h1 className="cell small-6"> {slotName} Slot </h1>
                    {whosTurnIcon}
                    <div className="cell small-3 played-card"> 
                        {playedCardSlot}
                    </div>
                </div>
                    {cardsArray}
            </div>
        </>
    )

}

export default PlayerTile