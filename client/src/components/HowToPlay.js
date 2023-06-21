import React from "react";


const HowToPlay = () => {

    return (
        <div className="how-to-play-page grid-x">
            <div className="welcome-section how-to-play cell small-10">
                <h1>How to Play</h1>
                <p>Oh Hell is a card game where we try to guess how many tricks we can win each round. Each time we are dealt cards it's called a Round. Every card we are dealt represents a Trick we can win</p>
                
                <p> First, we deal each player some cards. Everyone gets the same number of cards, and we hold them in our hands. We also flip over the top card of the deck, its suit is Trump suit
                </p>
                <p> Then, we take turns guessing how many tricks we think we can win. A trick is when everyone plays one card, and the person with the best card wins that round.</p>
                <p> We start with the player to the left of the dealer. They say a number like "two tricks" or "three tricks." We keep going around, and each player guesses how many tricks they think they can win.</p>
                <p> After that, we start playing the rounds. We all play one card from our hand in each round. The person who played the highest card wins that trick <strong> and gets to play first(lead) on the next Trick</strong></p>
                <p> But be careful! We have to follow some rules. In each round, we have to play a card of the same suit as the first card played (Lead suit) if we have one. If we don't have that suit, we can play any card we want.</p>
                <p> We keep playing rounds until we finish all the cards in our hands.</p>
                <p>At the end of each Round, we see who guessed the number of tricks correctly. If we guessed it right, we get our Bet plus one point. If we guessed it wrong, we get ZERO points.
                </p>
                <p>The player with the most points at the end of the game is the winner!</p>
                <p>Card values go:
                    <ol>
                        <li>Highest of the Trump suit</li>
                        <li>Highest of the Lead suit</li>
                        <li>Everything else automatically loses</li>
                    </ol>
                    *Aces are high and all cards follow their face value
                </p>
                <p>CAVEAT: when betting, the dealer always bets last and they cannot bet an amount that make the total bets made equal the number of tricks able to be won in a Round(This makes is so that there is always a loser every Round.)</p>
                <p>   Example: A round of 4 Tricks is dealt. Player 1(left of the dealer) bets 1, Player 2 bets 1, Player 3 bets 1. It's the Dealer's turn to bet but they cannot bet 1 because the total of bets would equal 4(the number of Tricks in the Round). If they did bet 1, it means that Player 1 could win 1 trick and make their bet; the same goes for Player 2, Player 3 and the Dealer - everyone would have made their bet and been awarded points</p>

                <p>STRATEGY
                    <ul>If the round had 4 Tricks and every player bet 4, it would mean that the Round is overbid by a whopping 12 points - what this means: everyone is looking to win tricks and indicates the aggressiveness of play</ul>
                    <ul>It's often easier to lose tricks than to win them. If you bet 0 and someone plays a Trump suit, and you do not have Trump, play one of your high cards to decrease your chances of winning on the next Trick </ul>
                </p>


                <p>That's the basic idea of Oh Hell. It's a fun game of guessing and playing cards.</p>


            </div>
        </div>
    )
    
}

export default HowToPlay