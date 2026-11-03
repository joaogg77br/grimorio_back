import express from "express"
import cors from "cors"
import Router from "./modules/routes.ts";
import "dotenv/config"
import http from "http"
import { Server } from "socket.io"
import { prisma } from "./prisma.ts";
const app = express();
const server = http.createServer(app);
const PORT = 3000
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://grimoriothamatof.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
  }
})

io.on("connection", (socket) => {
  console.log("usuario conectado")
  socket.on("message", (data) => {
    console.log("message", data)
    socket.send(data)
  })
  socket.on("disconnect", () => {
    console.log("usuario disconnected")
  })
})

app.use(cors());
app.use(express.json());
app.use(Router)
export default server


