import express from "express";
import { prisma } from "../main";
import { verificadorDeEmail } from "../middlewares/middlewaresUser";
import { MinHeroStatus } from "../middlewares/MinimoPersonagem";
const Router = express.Router();
//createUser
Router.post("/create/user", verificadorDeEmail, async (req, res) => {
    const { nome, emailUser } = req.body;
    const user = await prisma.user.create({
        data: {
            name: nome,
            email: emailUser,
        },
        include: {
            fichas: true
        }
    });
    res.status(200).json({ message: "Sucesso", user: user });
});
Router.get("/find/allusers", async (req, res) => {
    try {
        const allusers = await prisma.user.findMany({
            include: {
                fichas: true
            }
        });
        res.status(200).json({ Sucesso: `sucesso`, usersFind: allusers });
    }
    catch (err) {
        res.status(400).json({ Error: `Erro ao procurar usuarios ${err}` });
    }
});
//loginUser
Router.post("/login", async (req, res) => {
    const { emailOrNickName } = req.body;
    try {
        const userLogin = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailOrNickName },
                    { name: emailOrNickName }
                ]
            }
        });
        console.log("usuario fez o login", userLogin);
        if (!userLogin)
            return res.status(400).json({ ErrorMessage: `Erro ao fazer login, usuario ou email nao encontrado` });
        return res.status(200).json({ message: "Sucesso, usuario fez login com sucesso", loginValid: true, emailOrNickName });
    }
    catch (err) {
        res.status(400).json({ Error: err, ErrorMessage: `Erro ao fazer login` });
    }
});
// Personagens  
Router.post("/create/personagem", MinHeroStatus, async (req, res) => {
    const { nomePersonagem, nomeJogador, raca, divindade, origem, classe, nivel, defesa, for_, con, des, int_, sab, car, pvMax, pvCurrent, pmMax, pmCurrent, deslocamento, tibao, jogadorId, pericias } = req.body;
    try {
        const ficha = await prisma.ficha.create({
            data: {
                nomeJogador,
                nomePersonagem,
                divindade,
                raca,
                origem,
                classe,
                nivel: Number(nivel),
                defesa: Number(defesa),
                for: for_,
                con: Number(con),
                des: Number(des),
                int: Number(int_),
                sab: Number(sab),
                car: Number(car),
                pvMax: Number(pvMax),
                pmMax: Number(pmMax),
                pvCurrent: Number(pvCurrent),
                pmCurrent: Number(pmCurrent),
                tibao,
                deslocamento: Number(deslocamento),
                jogadorId: Number(jogadorId),
                pericias: {
                    createMany: {
                        data: pericias.map(item => ({
                            atributo: item.atributo,
                            nome: item.nome,
                            metadeDoNivel: item.metadeDoNivel,
                            treino: item.treino,
                            outros: item.outros
                        }))
                    }
                }
            },
            select: {
                armas: true,
                protecoes: true,
                id: true,
                gerais: true,
                pericias: true
            }
        });
        res.status(201).json({ message: "Ficha criada com sucesso", ficha });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ Error: err, ErrorMessage: `Erro ao tentar criar ficha tente novamente mais tarde` });
    }
});
Router.post("", async (req, res) => {
});
// Personagens  
Router.put("/atualize/ficha/personagem/:fichaId", async (req, res) => {
    const { fichaId } = req.params;
    const data = {};
    if (req.body.nomePersonagem !== undefined)
        data.nomePersonagem = req.body.nomePersonagem;
    if (req.body.nomeJogador !== undefined)
        data.nomeJogador = req.body.nomeJogador;
    if (req.body.raca !== undefined)
        data.raca = req.body.raca;
    if (req.body.divindade !== undefined)
        data.divindade = req.body.divindade;
    if (req.body.origem !== undefined)
        data.origem = req.body.origem;
    if (req.body.classe !== undefined)
        data.classe = req.body.classe;
    if (req.body.nivel !== undefined)
        data.nivel = req.body.nivel;
    if (req.body.defesa !== undefined)
        data.defesa = req.body.defesa;
    if (req.body.for_ !== undefined)
        data.for_ = req.body.for_;
    if (req.body.con !== undefined)
        data.con = req.body.con;
    if (req.body.des !== undefined)
        data.des = req.body.des;
    if (req.body.int_ !== undefined)
        data.int_ = req.body.int_;
    if (req.body.sab !== undefined)
        data.sab = req.body.sab;
    if (req.body.car !== undefined)
        data.car = req.body.car;
    if (req.body.pvMax !== undefined)
        data.pvMax = req.body.pvMax;
    if (req.body.pvCurrent !== undefined)
        data.pvCurrent = req.body.pvCurrent;
    if (req.body.pmMax !== undefined)
        data.pmMax = req.body.pmMax;
    if (req.body.pmCurrent !== undefined)
        data.pmCurrent = req.body.pmCurrent;
    if (req.body.deslocamento !== undefined)
        data.deslocamento = req.body.deslocamento;
    try {
        const ficha = await prisma.ficha.update({
            where: { id: Number(fichaId) },
            data
        });
        res.status(201).json({ message: "Ficha editada com sucesso", ficha });
    }
    catch (err) {
        res.status(400).json({ Error: err, ErrorMessage: `Erro ao editar ficha tente novamente mais tarde` });
    }
});
Router.delete("/deleteFicha/:fichaId", async (req, res) => {
    let { fichaId } = req.params;
    const fichaIDNumber = parseInt(`${fichaId}`);
    try {
        const fichaDeletada = await prisma.ficha.delete({
            where: {
                id: fichaIDNumber
            }
        });
        console.log(fichaDeletada);
        res.status(200).json({ Sucesso: "Ficha deletada com sucesso", SucessoMessage: fichaDeletada });
    }
    catch (err) {
        res.status(400).json({ Error: err, ErrorMessage: `Erro ao deletar a ficha` });
    }
});
Router.get("/todasAsFichas/:userId", async (req, res) => {
    let { userId } = req.params;
    const userIdNumber = parseInt(`${userId}`);
    try {
        console.log(userId);
        const fichas = await prisma.ficha.findMany({
            where: {
                jogadorId: userIdNumber
            },
        });
        console.log("fichas", fichas);
        if (fichas.length <= 0)
            res.status(400).json({ Error: "Usuario nao encontrado", ErrorMessage: `Erro ao tentar buscar todasAsFichas` });
        res.status(201).json({ message: "Fichas trazidas sucesso", data: fichas });
    }
    catch (err) {
        res.status(400).json({ Error: err, ErrorMessage: `Erro ao tentar buscar todasAsFichas` });
    }
});
Router.post("/equipamentos/create/Armas", async (req, res) => {
    try {
        const { fichaId, nome, preco, dadoDeDano, alcance, peso, tipoDano, tipoArma, critico, multiplicador, descricao } = req.body;
        const arma = await prisma.arma.create({
            data: {
                fichaId: fichaId,
                nome,
                peso,
                alcance,
                preco,
                tipoDano,
                descricao,
                critico,
                tipoArma,
                multiplicador,
                dadoDeDano
            }
        });
        res.status(201).json({ message: "Arma criada com sucesso", data: arma });
    }
    catch (err) {
        res.status(400).json({ Error: err, ErrorMessage: `Erro ao tentar adicionarEquipamento` });
    }
});
Router.get("/equipamentos/listAll/Armas/:fichaId", async (req, res) => {
    const { fichaId } = req.params;
    const id = parseInt(`${fichaId}`);
    try {
        const armas = await prisma.arma.findMany({
            where: {
                fichaId: id
            }
        });
        return res.status(201).json({ message: "Armas listadas com sucesso", data: armas });
    }
    catch (err) {
        return res.status(400).json({ Error: err, ErrorMessage: `Erro ao ListarEquipamento` });
    }
});
Router.delete("/equipamentos/delete/Armas/:armaId", async (req, res) => {
    const { armaId } = req.params;
    const id = parseInt(`${armaId}`);
    try {
        const ArmaDeletada = await prisma.arma.delete({
            where: {
                id
            }
        });
        res.status(200).json({ Sucess: "Sucesso, arma deletada com sucesso", ArmaDeletada });
    }
    catch (err) {
        res.status(400).json({ Error: err, ErrorMessage: `Erro ao tentar deletar arma,tente novamente mais tarde ` });
    }
});
//protecoes
Router.post("/equipamentos/create/Protecao", async (req, res) => {
    try {
        const { fichaId, tipoProtecao, penalidade, nomeProtecao, preco, peso, descricao, bonus } = req.body;
        const protecao = await prisma.protecao.create({
            data: {
                fichaId: fichaId,
                nomeProtecao,
                peso,
                penalidade,
                preco,
                descricao,
                bonus,
                tipoProtecao,
            }
        });
        res.status(201).json({ message: "Arma criada com sucesso", data: protecao });
    }
    catch (err) {
        res.status(400).json({ Error: err, ErrorMessage: `Erro ao tentar adicionarEquipamento` });
    }
});
Router.get("/equipamentos/listAll/Protecao/:fichaId", async (req, res) => {
    const { fichaId } = req.params;
    const id = parseInt(`${fichaId}`);
    try {
        const protecoes = await prisma.protecao.findMany({
            where: {
                fichaId: id
            }
        });
        return res.status(201).json({ message: "Protecoes listadas com sucesso", data: protecoes });
    }
    catch (err) {
        return res.status(400).json({ Error: err, ErrorMessage: `Erro ao ListarEquipamento` });
    }
});
Router.delete("/equipamentos/delete/Protecao/:id", async (req, res) => {
    const { id } = req.params;
    const protecaoId = parseInt(`${id}`);
    try {
        const ProtecaoDeletada = await prisma.protecao.delete({
            where: {
                id: protecaoId
            }
        });
        res.status(200).json({ Sucess: "Sucesso, protecao deletada com sucesso", ProtecaoDeletada });
    }
    catch (err) {
        res.status(400).json({ Error: err, ErrorMessage: `Erro ao tentar deletar arma,tente novamente mais tarde ` });
    }
});
Router.post("/magias/create/", async (req, res) => {
    const { nome, execucao, alcance, alvo, duracao, truque, tipoMagia, gastoPe, descricao, Circulo, fichaId } = req.body;
    try {
        const magia = await prisma.magia.create({
            data: {
                execucao,
                alcance,
                alvo,
                nome,
                duracao,
                truque,
                gastoPe,
                descricao,
                tipoMagia,
                Circulo,
                fichaId
            }
        });
        res.status(200).json({ Sucess: "Sucesso, magia criada com sucesso", data: magia });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ Error: err, ErrorMessage: "Erro nao foi possivel criar magia" });
    }
});
Router.post("/magias/delete/:id", async (req, res) => {
    const { id } = req.params;
    const magiaId = parseInt(`${id}`);
    try {
        const magia = await prisma.magia.delete({
            where: {
                id: magiaId
            }
        });
        res.status(200).json({ Sucess: "Sucesso, magia criada com sucesso", data: magia });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ Error: err, ErrorMessage: "Erro nao foi possivel criar magia" });
    }
});
Router.post("/magias/listAll/", async (req, res) => {
    try {
        const magias = await prisma.magia.findMany();
        res.status(200).json({ Sucess: "Sucesso", data: magias });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ Error: err, ErrorMessage: "Erro nao foi possivel criar magia" });
    }
});
Router.get("/pericias/list/:fichaId", async (req, res) => {
    const { fichaId } = req.params;
    try {
        const pericias = await prisma.pericia.findMany({
            where: {
                fichaId: Number(fichaId)
            },
            select: { fichaId: true, id: true, treino: true, outros: true, metadeDoNivel: true, atributo: true, nome: true }
        });
        res.status(200).json({ Sucess: "Pericia atualizada  com sucesso", pericias });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ Erro: err, ErrorMessage: "Erro ao listar pericias" });
    }
});
Router.put("/pericias/update/:periciaId", async (req, res) => {
    const { periciaId } = req.params;
    const data = req.body;
    try {
        const pericias = await prisma.pericia.update({
            where: { id: Number(periciaId) },
            data
        });
        console.log(pericias);
        res.status(200).json({ Sucess: "Pericia atualizada  com sucesso", pericias });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ Error: err, ErrorMessage: "Erro ao criar as pericias" });
    }
});
//Campanhas
export default Router;
//# sourceMappingURL=routes.js.map