import express from "express"
import { verificadorDeEmail } from "../middlewares/middlewaresUser.js";
import bcrypt from "bcrypt";
import VerifyLogin from "../middlewares/verifyLogin.js";
import jwt from "jsonwebtoken";
const segredoJWT = process.env.JWT_SECRET;
import verifyOrigem from "../middlewares/verifyOrigem.js";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const Router = express.Router();
import { prisma } from "../app.js";
import { type Request, type Response } from "express"

type userRegister = {
  nome: string;
  emailUser: string;
  password: string;
};

Router.post(
  "/create/user",
  verificadorDeEmail,
  async (req: Request, res: Response) => {
    const { nome, emailUser, password }: userRegister = req.body;
    const secretPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: nome,
        email: emailUser,
        password: `${secretPassword}`,
      },
      include: {
        fichas: true,
      },
    });
    res.status(200).json({ message: "Sucesso", user: user });
  },
);


Router.put(
  "/update/user/:id",
  VerifyLogin,
  async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    if (!Number.isInteger(userId) || userId <= 0) {
      return res
        .status(400)
        .json({ success: false, erro: "Id de usuário inválido" });
    }
    if (!name || !EMAIL_REGEX.test(email)) {
      return res
        .status(400)
        .json({ success: false, erro: "Nome ou e-mail inválido" });
    }

    try {
      const authenticatedUser = await prisma.user.findUnique({
        where: { email: res.locals.authEmail },
        select: { id: true },
      });
      if (!authenticatedUser || authenticatedUser.id !== userId) {
        return res.status(403).json({
          success: false,
          erro: "Acesso permitido somente ao próprio usuário",
        });
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: { name, email },
        select: { id: true, name: true, email: true, campanhaId: true },
      });
      const token = jwt.sign({ email: user.email }, `${segredoJWT}`, {
        expiresIn: "100h",
      });
      return res
        .status(200)
        .json({ message: "Sucesso ao editar usuario", user, token });
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ success: false, erro: "Erro ao editar usuario" });
    }
  },
);

Router.delete(
  "/delete/user/:id",
  VerifyLogin,
  verifyOrigem,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const user = await prisma.user.delete({
        where: {
          id: Number(id),
        },
      });
      res
        .status(200)
        .json({ message: "Sucesso ao deletar usuario", user: user });
    } catch (err) {
      console.log(err);
      res.status(400).json({ sucess: false, error: err });
    }
  },
);

Router.get("/find/allusers", async (req: Request, res: Response) => {
  try {
    const allusers = await prisma.user.findMany({
      include: {
        fichas: true,
      },
    });
    res.status(200).json({ Sucesso: `sucesso`, usersFind: allusers });
  } catch (err) {
    res.status(400).json({ Error: `Erro ao procurar usuarios ${err}` });
  }
});

export default Router;
