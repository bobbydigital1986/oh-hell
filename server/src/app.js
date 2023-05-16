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
    console.log("selectedGame", selectedGame)
    if (selectedGame.findGame) {
      io.to(socket.id).emit('game:create join-existing', selectedGame.findGame.id)
    } else {
      io.to(socket.id).emit('game:create success', selectedGame.newGame.id)
    }
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log("Server started on port 3000")
})

export default app;
