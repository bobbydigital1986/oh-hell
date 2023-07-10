# Oh-Hell!

Oh-hell is a multiplayer, turn-based, betting and trick-taking card game built for the web using Socket.io, Node and React.


# How to Play

Oh-hell is deployed to Heroku and available at https://oh-hell-app.herokuapp.com/

The card game is multiplayer but you can create of any number of players and just click 'Start Game' to begin. I will say that there isn't much to experience by yourself but you will get a feel for the aesthetics and game mechanics. 

# Tech Stack

Oh-Hell is entirely operated by React, Socket.io, and Node. There are no API calls nor did I need to leverage Express except for some basic user management(along with Passenger).

React serves the frontend leveraging some Foundation library components.

Socket.Io operates as the two-way connection between server and client. When a player puts down a card, they send their played card information to the server which handles game logic and then broadcasts to the other players(clients) the played card information.

Node powers the backend which handles the bulk of game logic. I intentionally handled all game logic on the backend to maintain synchronicity between clients.