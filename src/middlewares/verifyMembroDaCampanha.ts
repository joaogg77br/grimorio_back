import jwt from "jsonwebtoken";
const item = process.env.SECRET_JWT;
import { prisma } from "../app.js";
import { NextFunction, Request, Response } from "express";
//ficha:1,campanha:1
export default async function verifyMembroCampanha(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { campanhaId } = req.params;
  let { userId } = res.locals;
  console.log(userId);
  if (!userId || !campanhaId) {
    return res.status(400).json({
      sucess: false,
      userId: userId,
      campanhaId: campanhaId,
      error: "Parametros invalidos",
    });
  }
  const ficha = await prisma.user.findFirst({
    where: {
      id: userId,
      campanhas: {
        some: { id: Number(campanhaId) },
      },
    },
    select: {
      id: true,
    },
  });
  console.log(ficha);

  if (!ficha) {
    return res.status(403).json({
      success: false,
      error: "Usuário não pertence à campanha.",
    });
  }

  next();
}
