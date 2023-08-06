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
import { Game, Registration, Trick, Round } from "./models/index.js"
import createGame from "./services/createGame.js";
import gameStarter from "./services/gameStarter.js"
import joinGame from "./services/joinGame.js"
import playCardHandler from "./services/playCardHandler.js";
import newRoundStarter from "./services/newRoundStarter.js";
import betHandler from "./services/betHandler.js"
import reconnectHelper from "./services/reconnectHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
import hbsMiddleware from "express-handlebars";
import RegistrantSerializer from "./serializers/RegistrantSerializer.js";

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

  socket.on('chat message', (message, gameId) => {
    io.in(gameId).emit('chat message', message);
  });

  socket.on('game:create', async(user, numberOfPlayers, numberOfRounds, gameCreate) => {
    const selectedGame = await createGame(user, numberOfPlayers, numberOfRounds, gameCreate)

    if (selectedGame.findGame) {
      io.to(socket.id).emit('game:create join-existing', { existingGameId: selectedGame.findGame.id })
    } else {
      io.to(socket.id).emit('game:create success', { newGameId: selectedGame.newGame.id })
    }
  })

  socket.on('game:start', async(gameInfo, players) => {
    const gameId = gameInfo.id
    const gameStartPackage = await gameStarter(gameInfo, players)
    io.in(gameId).emit("game:start success", gameStartPackage)
  })

  socket.on('game:joined', async({ gameId, user }) => {
    socket.user = user
    console.log("game:joined user", user)
    const game = await Game.query().findById(gameId)
    const joinedGameResult = await joinGame(game, user.id)
    if (joinedGameResult == 'redirect') {
      //game full - redirect user to homepage
      io.to(socket.id).emit('game:joined redirect')
    } else if (joinedGameResult == 'reconnect') {
      //player found - send reconnect gameState package
      const gameState = await reconnectHelper(game, user)
      socket.join(gameId)
      io.to(socket.id).emit('game:joined reconnect', gameState)
    } else {
      //game successfully joined - current players returned
      socket.join(gameId)
      io.to(socket.id).emit('game:joined success', { game, players: joinedGameResult })
      socket.to(gameId).emit('player:joined', { players: joinedGameResult })
    }
  })

  socket.on('bet:submitted', async(user, game, bet, round) => {
    const betResponse = await betHandler(bet, round, game, user)
    console.log("betResponse", betResponse)
    io.to(game.id).emit('bet:submitted success', betResponse)
  })

  socket.on('game:full', async(gameInfo) => {
    await Game.query().findById(gameInfo.id).patch({ acceptingRegistrants: false })
  })

  socket.on('card:played', async(game, round, trick, card) => {
    const gameId = game.id
  

    const playCardResponse = await playCardHandler(game, round, trick, card)
        
    if (playCardResponse.phaseOver.whatsOver == "trick") {
      io.in(gameId).emit('card:played trickOver', playCardResponse)

    } else if (playCardResponse.phaseOver.whatsOver == "round") {
      io.in(gameId).emit('card:played trickAndRoundOver', playCardResponse)

    } else if (playCardResponse.phaseOver.whatsOver == "game") {
      io.in(gameId).emit('card:played gameOver', playCardResponse)
    } else {
      // Continue playing trick
      io.in(gameId).emit('card:played success', playCardResponse)
    }   
  })

  socket.on("trick:next", async(gameId, round) => {
    let newTrickPackage = {
      round: {},
      newTrick: {},
      dealtCards: []
    }

    const lastWinner = await Trick.query()
      .where({ roundId: round.id })
      .orderBy("createdAt", 'desc')
      .limit(1)

    const latestRound = await Round.query().patchAndFetchById(round.id, { whosTurn: lastWinner[0].winnerId })
    newTrickPackage.round = latestRound
    newTrickPackage.newTrick = await Trick.query().insertAndFetch({ roundId: latestRound.id })

    const remainingCardsInHand = await latestRound.$relatedQuery("cards")
      .where('trickPlayedId', null)
    
    newTrickPackage.dealtCards = remainingCardsInHand
    io.in(gameId).emit("trick:next success", (newTrickPackage))
    
  })

  socket.on("round:next", async(gameInfo, round) => {
    const gameId = gameInfo.id
    const roundPackage = await newRoundStarter(gameId, round)
    io.in(gameId).emit("round:next success", roundPackage)
    
  })
  
  socket.on('disconnecting', () => {
    console.log("disconnecting user", socket.user)
    console.log("disconnecting user's room", socket.rooms)
    console.log("disconnecting user's data", socket.data)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(configuration.web.port, configuration.web.host, () => {
  console.log(`Server is listening on port ${configuration.web.port}`)
})

export default app;
