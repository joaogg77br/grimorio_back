import { NextFunction, Request, Response } from "express";
const chaveSecretaJwt = process.env.JWT_SECRET;
import jwt from "jsonwebtoken";
import { prisma } from "../app.js";

function getToken(req: Request) {
  const authorization = req.headers.authorization;
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7);
  return typeof req.body?.token === "string" ? req.body.token : "";
}

export default async function verifyMestreDaCampanha(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = getToken(req);
    const { playerId, campanhaId } = req.params;
    let decoded = jwt.verify(token, `${chaveSecretaJwt}`) as {
      id?: number;
      email?: string;
    };

    const campanha = await prisma.campanha.findUnique({
      where: { id: Number(campanhaId) },
      select: { id: true, playerMestreId: true },
    });

    if (campanha?.playerMestreId !== decoded.id)
      return res
        .status(400)
        .json({ sucess: false, Erromessage: "Nao autorizado" });
    next();
  } catch (err) {
    console.log(err)
    return res.status(400).json({ sucess: false, ErroMessage: "Error" + err });
  }
}
