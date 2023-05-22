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
    console.log("in player tile dealt cards", dealtCards)
    console.log("in player tile played cards", playedCards)
    
    let cardsArray
    let playedCardSlot = (
        "Played Card Slot"
    )
    if (dealtCards) {
        let noLeadSuitInHand = false
        if (!leadSuit) {
            noLeadSuitInHand = true
        } else {
            if (dealtCards.find(cardSuit => cardSuit.suitId == leadSuit)) {
                noLeadSuitInHand = false
            }
        }
        
        cardsArray = dealtCards.map((card => {
            let canPlay = false
            if (noLeadSuitInHand === true) {
                canPlay = true
            } else {
                if (card.suitId === leadSuit.id) {
                    canPlay = true
                }
            }
            if (!playedCards.find(playedCard => card.id === playedCard.id)) {
                console.log("didn't find it in playedCards", card)
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
    console.log(trickOver)
    if (trickOver.winnerId == player?.id) {
        console.log("winner found")

        if (roundOver) {
            //Trick and Round over
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
    } else if (whosTurn === player?.id) {
        whosTurnIcon = (
            <div className="cell small-3">{player?.username}'s turn</div>
        )
        console.log("designated next turn")
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