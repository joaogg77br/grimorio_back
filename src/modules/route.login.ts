import express from "express"
import VerifyLogin from "../middlewares/verifyLogin.js";
const Router = express.Router();
import { Request, Response, NextFunction } from "express"
import { prisma } from "../app.js";
const segredoJWT = process.env.JWT_SECRET;
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//loginUser
Router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userLogin = await prisma.user.findUnique({
      where: { email },
    });

    if (!userLogin)
      return res.status(400).json({
        ErrorMessage: `Erro ao fazer login, usuario ou email nao encontrado`,
      });

    const token = jwt.sign(
      { id: userLogin.id, email: userLogin.email },
      `${segredoJWT}`,
      {
        expiresIn: "100h",
      },
    );
    const result = await bcrypt.compare(password, userLogin.password);

    if (result) {
      return res.status(200).json({
        message: "Sucesso, usuario fez login com sucesso",
        loginValid: true,
        userLogin,
        token,
      });
    }
    return res
      .status(400)
      .json({ ErrorMessage: `Erro ao fazer login,senha ou email incorreta` });
  } catch (err) {
    res.status(400).json({ Error: err, ErrorMessage: `Erro ao fazer login` });
  }
});


Router.post("/logged", VerifyLogin, async (req: Request, res: Response) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim() : "";
  if (email !== res.locals.authEmail) {
    return res
      .status(401)
      .json({ success: false, erro: "Token de acesso expirado" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, erro: "Usuário não encontrado" });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ success: false, erro: "Erro ao validar sessão" });
  }
});

export default Router;  
