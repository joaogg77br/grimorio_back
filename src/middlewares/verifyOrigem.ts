import { NextFunction, Request, Response } from "express";
const chaveSecretaJwt = process.env.JWT_SECRET;
import jwt from "jsonwebtoken";

function getToken(req: Request) {
  const authorization = req.headers.authorization;
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7);
  return typeof req.body?.token === "string" ? req.body.token : "";
}

export default function verifyOrigem(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = getToken(req);
  const decoded = jwt.verify(token, `${chaveSecretaJwt}`) as {
    email?: string;
    id?: number;
  };
  const { id } = req.body;

  if (!decoded.id) {
    return res.status(400).json({
      sucess: false,
      Message: "Token invalido",
    });
  } else if (decoded.id != id) {
    return res.status(400).json({
      sucess: false,
      Message: "Usuario nao pode fazer tais alteracoes",
    });
  }
  next();
}
