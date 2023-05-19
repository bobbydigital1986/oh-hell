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
import { Game, User, Registration } from "./models/index.js"
import createGame from "./services/createGame.js";
import startGame from "./services/startGame.js"
import joinGame from "./services/joinGame.js"


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

  socket.on('game:create', async(user) => {
    const selectedGame = await createGame(user)
    // console.log(selectedGame)
    // console.log("selectedGame", selectedGame)
    if (selectedGame.findGame) {
      io.to(socket.id).emit('game:create join-existing', { existingGameId: selectedGame.findGame.id })
    } else {
      io.to(socket.id).emit('game:create success', { newGameId: selectedGame.newGame.id })
    }
  })

  socket.on('game:start', async(gameData) => {
    console.log("entered game start", gameData.gameId, gameData.players)
    const gamePackage = await startGame(gameData.gameId, gameData.players)
    // console.log(gamePackage)
    io.in(gameData.gameId).emit("game:start success", gamePackage)
  })

  socket.on('game:joined', async({ gameId, user }) => {
    console.log('gameId', gameId)
    console.log('userId', user)
    socket.user = user
    console.log("socket.user", socket.user)
    const game = await Game.query().findById(gameId)
    const joinedAction = await joinGame(game, user.id)
    const currentPlayers = await game.$relatedQuery("registrants")
    socket.join(gameId)
    io.to(socket.id).emit('game:joined success', { game, players: currentPlayers })
    // socket.to(gameId).emit('player:joined', socket.user)
    socket.to(gameId).emit('player:joined', {players: currentPlayers})

  })

  socket.on('card:played', async(gameId, userId, trickId, card) => {

    ///SHOULD BE A SERVICE TO HANDLE A CARD PLAY
      //ADD TO CARD TABLE: TRICKPLAYED AND IF FIRST OF TRICK, TRICKLEADSUIT
      //CHECK IF THIS IS THE LAST CARD OF THE TRICK
      ///HANDLE WIN LOGIC FOR ROUND
  
    const cardPlayedGraph = []
    cardPlayedGraph.id = gameId
    cardPlayedGraph.cards = [
      {
        id: card.id,
        trickPlayedId: trickId,
        trickLeadSuit: trickId
      }
    ]
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

server.listen(3000, () => {
  console.log("Server started on port 3000")
})

export default app;
