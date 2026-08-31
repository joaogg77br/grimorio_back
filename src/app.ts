import express from "express"
import cors from "cors"
import Router from "../src/modules/routes.ts";
import "dotenv/config"
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
export default app
