import { type Response, type Request, type NextFunction } from "express"
import * as z from "zod"
import { prisma } from "../main"
const userRegister = z.object({
  nome: z.string(),
  email: z.email({ error: "Email incorreto" })
})

type userRegister = z.infer<typeof userRegister>;

async function verificadorDeEmail(req: Request, res: Response, next: NextFunction) {
  const { nome, emailUser } = req.body;
  console.log(emailUser)
  const user: userRegister = { email: emailUser, nome }
  userRegister.parse({ nome, email: emailUser })

  const emailFinded = await prisma.user.findUnique({
    where: { email: emailUser },
    select: { email: true }
  })

  console.log("email", emailFinded)
  if (emailFinded) return res.status(400).json({ errorMessage: "Erro email ja encontrado" })

  next()
}


export { verificadorDeEmail } 
