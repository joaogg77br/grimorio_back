import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const segredoJWT = process.env.JWT_SECRET

function getToken(req: Request) {
  const authorization = req.headers.authorization
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7)
  return typeof req.body?.token === "string" ? req.body.token : ""
}

export default function VerifyLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getToken(req)
    const decoded = jwt.verify(token, `${segredoJWT}`) as { email?: string }
    if (!decoded.email) {
      return res.status(401).json({ success: false, erro: "Token de acesso inválido" })
    }
    res.locals.authEmail = decoded.email
    return next()
  } catch {
    return res.status(401).json({ success: false, erro: "Token de acesso expirado" })
  }
}
