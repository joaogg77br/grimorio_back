import express from "express"
import cors from "cors"
import Router from "./modules/routes.js";
import "dotenv/config"
import http from "http"
import { Server } from "socket.io"
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
const app = express();
const server = http.createServer(app);
const PORT = 3000
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter })
const io = new Server(server)

io.on("connection", (socket) => {
  console.log("usuario conectado")
})

app.use(cors());
app.use(express.json());
app.use(Router)
export { prisma }

export default server


