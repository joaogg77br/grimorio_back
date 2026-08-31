import * as z from "zod";
import { prisma } from "../app.js";
const userRegister = z.object({
    nome: z.string(),
    email: z.email({ error: "Email incorreto" })
});
async function verificadorDeEmail(req, res, next) {
    const { nome, emailUser } = req.body;
    console.log(emailUser);
    const user = { email: emailUser, nome };
    userRegister.parse({ nome, email: emailUser });
    const emailFinded = await prisma.user.findUnique({
        where: { email: emailUser },
        select: { email: true }
    });
    console.log("email", emailFinded);
    if (emailFinded)
        return res.status(400).json({ errorMessage: "Erro email ja encontrado" });
    next();
}
export { verificadorDeEmail };
//# sourceMappingURL=middlewaresUser.js.map