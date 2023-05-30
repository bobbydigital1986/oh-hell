import express from "express";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import "./boot.js";
import configuration from "./config.js";
import addMiddlewares from "./middlewares/addMiddlewares.js";
import rootRouter from "./routes/rootRouter.js";
import { createServer } from "http"
import { Server } from "socket.io"
import { Game, User, Registration, Trick } from "./models/index.js"
import createGame from "./services/createGame.js";
import gameStarter from "./services/gameStarter.js"
import joinGame from "./services/joinGame.js"
import playCardHandler from "./services/playCardHandler.js";
import newRoundStarter from "./services/newRoundStarter.js";
import betHandler from "./services/betHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
import hbsMiddleware from "express-handlebars";

app.set("views", path.join(__dirname, "../views"));
app.engine(
  "hbs",
  hbsMiddleware({
    defaultLayout: "default",
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
addMiddlewares(app);
app.use(rootRouter);

const server = createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('chat message', (message) => {
    console.log(`Received message: ${message}`);
    io.emit('chat message', message);
  });

  socket.on('game:create', async(user, numberOfPlayers, numberOfRounds) => {
    const selectedGame = await createGame(user, numberOfPlayers, numberOfRounds)
    // console.log(selectedGame)
    // console.log("selectedGame", selectedGame)
    if (selectedGame.findGame) {
      io.to(socket.id).emit('game:create join-existing', { existingGameId: selectedGame.findGame.id })
    } else {
      io.to(socket.id).emit('game:create success', { newGameId: selectedGame.newGame.id })
    }
  })

  socket.on('game:start', async(gameInfo, players) => {
    const gameId = gameInfo.id
    console.log("entered game start", gameInfo, players)
    const gameStartPackage = await gameStarter(gameInfo, players)
    // console.log(gamePackage)
    io.in(gameId).emit("game:start success", gameStartPackage)
  })

  socket.on('game:joined', async({ gameId, user }) => {
    console.log('gameId', gameId)
    console.log('userId', user)
    socket.user = user
    console.log("socket.user", socket.user)
    const game = await Game.query().findById(gameId)
    const joinedAction = await joinGame(game, user.id)
    const currentPlayers = await game.$relatedQuery("players")
    socket.join(gameId)
    io.to(socket.id).emit('game:joined success', { game, players: currentPlayers })
    // socket.to(gameId).emit('player:joined', socket.user)
    socket.to(gameId).emit('player:joined', {players: currentPlayers})

  })

  socket.on('bet:submitted', async(user, game, bet, round) => {
    const betResponse = await betHandler(bet, round, game, user)
    io.to(game.id).emit('bet:submitted success', betResponse)
  })

  socket.on('game:full', async(gameInfo) => {
    console.log("game:full received")
    await Game.query().findById(gameInfo.id).patch({ acceptingRegistrants: false })
  })

  socket.on('card:played', async(game, round, trick, card) => {
    const gameId = game.id
  

    const playCardResponse = await playCardHandler(game, round, trick, card)
        
    console.log("playCardResponse", playCardResponse)
    if (playCardResponse.phaseOver.whatsOver == "trick") {
      console.log("playCardResponse.phaseOver.whatsOver == trick")
      io.in(gameId).emit('card:played trickOver', playCardResponse)
        // playCardResponse = {
        //     phaseOver: {
        //          whatsOver: "trick",
        //          winnerId: userId
        //     }
        //     playedCards: [playedCards]
        //     whosTurn: userId
        //     newTrick: newTrick
        // }
    } else if (playCardResponse.phaseOver.whatsOver == "round") {
      console.log("playCardResponse.phaseOver.whatsOver == round")
      io.in(gameId).emit('card:played trickAndRoundOver', playCardResponse)
        // playCardResponse = {
        //     phaseOver: {
        //          whatsOver: "round",
        //          winnerId: userId
        //     }
        //     playedCards: [playedCards],
        //     whosTurn???? <--- look into this
        // }
    } else {
      io.in(gameId).emit('card:played success', playCardResponse)
        // playCardResponse = {
        //     phaseOver: {
        //          whatsOver: "",
        //          winnerId: null
        //     }
        //     playedCards: [playedCards]
        //     whosTurn: userId
        // }
    }   
  })

  socket.on("trick:next", async(gameId) => {
    //Need to pass the winner of the previous trick as the player whosUp
    let newTrickPackage = {
      lastTrickWinnerId: null,
      newTrick: {},
      dealtCards: []
    }
    const latestRound = await Game.relatedQuery("rounds")
      .for(gameId)
      .orderBy("createdAt", 'desc')
      .limit(1)
    console.log("tricks:next latestRound", latestRound)

    const lastWinner = await latestRound[0].$relatedQuery('tricks')
      .select('winnerId')
      .orderBy("createdAt", 'desc')
      .limit(1)
    console.log("trick:next lastWinner", lastWinner[0].winnerId)

    newTrickPackage.lastTrickWinnerId = lastWinner[0].winnerId
    
    newTrickPackage.newTrick = await Trick.query().insertAndFetch({ roundId: latestRound[0].id })

    const remainingCardsInHand = await latestRound[0].$relatedQuery("cards")
      .where('trickPlayedId', null)
    console.log(remainingCardsInHand)
    
    newTrickPackage.dealtCards = remainingCardsInHand
    io.in(gameId).emit("trick:next success", (newTrickPackage))
    
  })

  socket.on("round:next", async(gameInfo, round) => {
    const gameId = gameInfo.id
    console.log("round next game info", gameInfo)
    const roundPackage = await newRoundStarter(gameId, round)
    console.log("round:next roundPackage", roundPackage)
    io.in(gameId).emit("round:next success", roundPackage)
    
  })
  
  socket.on('disconnecting', () => {
    console.log("disconnecting user", socket.user)
    console.log("disconnecting user's room", socket.rooms)
    console.log("disconnecting user's data", socket.data)
  })

  socket.on('disconnect', () => {
    // [socket, gameId] = socket.room
    console.log('Client disconnected');
  });
});

server.listen(configuration.web.port, configuration.web.host, () => {
  console.log(`Server is listening on port ${configuration.web.port}`)
})

export default app;
