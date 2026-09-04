import express from "express"
import cors from "cors"
import Router from "./modules/routes.js";
import "dotenv/config"
import { Server } from "socket.io"
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
const app = express();
const PORT = 3000
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter })
app.use(cors());
app.use(express.json());
app.use(Router)
export { prisma }
app.listen(PORT, () => { console.log("bomdia") })
export default app

