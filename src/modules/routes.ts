import express from "express"
import { type Request, type Response } from "express"
import { prisma } from "../app.js"
import { verificadorDeEmail } from "../middlewares/middlewaresUser.js";
import { MinHeroStatus } from "../middlewares/MinimoPersonagem.js";
import crypto from "crypto"

const Router = express.Router();
type userRegister = {
  nome: string,
  emailUser: string,
}

type Magias = {
  execucao: string
  alcance: string
  alvo: string
  duracao: string
  truque: string
  gastoPe: number
  tipoMagia: string
  descricao: string
  circulo: string
}

type Pericias = {
  nome: string,
  atributo: string,
  metadeDoNivel: number,
  treino: number,
  outros: number,
  fichaId: number
}


type PersonagemCreateData = {
  nomePersonagem: string;
  nomeJogador: string;
  raca: string;
  divindade: string;
  origem: string;
  classe: string;
  nivel: number;
  defesa: {
    outros: number,
    atributos: string
  };
  for_: number;
  con: number;
  des: number;
  int_: number;
  sab: number;
  car: number;
  pvMax: number;
  pvCurrent: number;
  pmMax: number;
  pmCurrent: number;
  deslocamento: number;
  tibao: any;
  jogadorId: number;
  descricao?: string;
  pericias: Pericias[];
  tamanho: string;
};

type PersonagemUpdateData = {
  nomePersonagem?: string;
  nomeJogador?: string;
  raca?: string;
  divindade?: string;
  origem?: string;
  classe?: string;
  nivel?: number;
  defesa?: {
    upsert: {
      create: { atributos: string, outros: number }
      update: { atributos: string, outros: number }
    }
  },
  for?: number;
  con?: number;
  des?: number;
  int?: number;
  sab?: number;
  car?: number;
  pvMax?: number;
  pvCurrent?: number;
  pmMax?: number;
  pmCurrent?: number;
  deslocamento?: number;
  tibao?: any;
  descricao?: string;
  tamanho?: string;
};


//createUser
Router.post("/create/user", verificadorDeEmail, async (req: Request, res: Response) => {
  const { nome, emailUser }: userRegister = req.body;
  const user = await prisma.user.create({
    data: {
      name: nome,
      email: emailUser,
    },
    include: {
      fichas: true
    }
  })
  res.status(200).json({ message: "Sucesso", user: user })
})


Router.get("/find/allusers", async (req: Request, res: Response) => {
  try {
    const allusers = await prisma.user.findMany({
      include: {
        fichas: true
      }
    })
    res.status(200).json({ Sucesso: `sucesso`, usersFind: allusers })
  } catch (err) {
    res.status(400).json({ Error: `Erro ao procurar usuarios ${err}` })
  }
})

//loginUser

Router.post("/login", async (req: Request, res: Response) => {
  const { emailOrNickName } = req.body;
  try {
    const userLogin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrNickName },
          { name: emailOrNickName }
        ]
      }
    })
    console.log("usuario fez o login", userLogin);
    if (!userLogin) return res.status(400).json({ ErrorMessage: `Erro ao fazer login, usuario ou email nao encontrado` });
    return res.status(200).json({ message: "Sucesso, usuario fez login com sucesso", loginValid: true, emailOrNickName });

  } catch (err) {
    res.status(400).json({ Error: err, ErrorMessage: `Erro ao fazer login` })
  }
})

// Personagens  
Router.post("/create/personagem", MinHeroStatus, async (req: Request, res: Response) => {
  const {
    nomePersonagem,
    nomeJogador,
    raca,
    divindade,
    origem,
    classe,
    nivel,
    defesa,
    for_,
    con,
    des,
    int_,
    sab,
    car,
    pvMax,
    pvCurrent,
    pmMax,
    pmCurrent,
    deslocamento,
    tibao,
    jogadorId,
    descricao,
    pericias,
    tamanho
  }: PersonagemCreateData = req.body;

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
        tamanho,
        deslocamento: Number(deslocamento),
        descricao: descricao ?? null,
        jogadorId: Number(jogadorId),
        defesa: {
          create: {
            atributos: defesa.atributos,
            outros: defesa.outros,
          }
        },
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
    })
    res.status(201).json({ message: "Ficha criada com sucesso", ficha })
  } catch (err) {
    console.log(err)
    res.status(400).json({ Error: err, ErrorMessage: `Erro ao tentar criar ficha tente novamente mais tarde` })
  }
})

// Personagens  
Router.put("/atualize/ficha/personagem/:fichaId", async (req: Request, res: Response) => {
  const { fichaId } = req.params;
  const data: PersonagemUpdateData = {};
  if (req.body.nomePersonagem !== undefined) data.nomePersonagem = req.body.nomePersonagem;
  if (req.body.nomeJogador !== undefined) data.nomeJogador = req.body.nomeJogador;
  if (req.body.raca !== undefined) data.raca = req.body.raca;
  if (req.body.divindade !== undefined) data.divindade = req.body.divindade;
  if (req.body.origem !== undefined) data.origem = req.body.origem;
  if (req.body.classe !== undefined) data.classe = req.body.classe;
  if (req.body.nivel !== undefined) data.nivel = req.body.nivel;
  if (req.body.for_ !== undefined) data.for = req.body.for_;
  if (req.body.con !== undefined) data.con = req.body.con;
  if (req.body.des !== undefined) data.des = req.body.des;
  if (req.body.int_ !== undefined) data.int = req.body.int_;
  if (req.body.sab !== undefined) data.sab = req.body.sab;
  if (req.body.car !== undefined) data.car = req.body.car;
  if (req.body.pvMax !== undefined) data.pvMax = req.body.pvMax;
  if (req.body.pvCurrent !== undefined) data.pvCurrent = req.body.pvCurrent;
  if (req.body.pmMax !== undefined) data.pmMax = req.body.pmMax;
  if (req.body.pmCurrent !== undefined) data.pmCurrent = req.body.pmCurrent;
  if (req.body.deslocamento !== undefined) data.deslocamento = req.body.deslocamento;
  if (req.body.tibao !== undefined) data.tibao = req.body.tibao;
  if (req.body.nomePersonagem !== undefined) data.nomePersonagem = req.body.nomePersonagem
  if (req.body.descricao !== undefined) data.descricao = req.body.descricao
  if (req.body.tamanho !== undefined) data.tamanho = req.body.tamanho
  // ... demais campos escalares iguais ...

  if (req.body.defesa !== undefined) {
    const outros = Number(req.body.defesa.outros ?? 0)
    const atributos = req.body.defesa.atributos ?? req.body.defesa.atributo ?? "Des"
    data.defesa = {
      upsert: {
        create: { outros, atributos },
        update: { outros, atributos },
      },
    }
  }
  try {
    const ficha = await prisma.ficha.update({
      where: { id: Number(fichaId) },
      data
    })
    res.status(201).json({ message: "Ficha editada com sucesso", ficha })
  } catch (err) {
    console.log(err)
    res.status(400).json({ Error: err, ErrorMessage: `Erro ao editar ficha tente novamente mais tarde` })
  }
})


Router.delete("/deleteFicha/:fichaId", async (req: Request, res: Response) => {
  let { fichaId } = req.params;
  const fichaIDNumber: number = parseInt(`${fichaId}`);
  try {

    const fichaDeletada = await prisma.ficha.delete({
      where: {
        id: fichaIDNumber
      }
    })
    console.log(fichaDeletada)
    res.status(200).json({ Sucesso: "Ficha deletada com sucesso", SucessoMessage: fichaDeletada })
  } catch (err) {
    res.status(400).json({ Error: err, ErrorMessage: `Erro ao deletar a ficha` })
  }

})

Router.get("/todasAsFichas/:userId", async (req: Request, res: Response) => {
  let { userId } = req.params;
  const userIdNumber = parseInt(`${userId}`)
  try {
    console.log(userId)
    const fichas: Array<any> = await prisma.ficha.findMany({
      where: {
        jogadorId: userIdNumber
      },
      include: {
        defesa: true
      }
    })

    console.log("fichas", fichas)
    if (fichas.length <= 0) res.status(400).json({ Error: "Usuario nao encontrado", ErrorMessage: `Erro ao tentar buscar todasAsFichas` })
    res.status(201).json({ message: "Fichas trazidas sucesso", data: fichas })
  } catch (err) {
    res.status(400).json({ Error: err, ErrorMessage: `Erro ao tentar buscar todasAsFichas` })
  }
})

// ==========================================
// EQUIPAMENTOS - CRUD COMPLETO
// ==========================================

// --- ARMAS ---
Router.post(["/equipamentos/create/Armas", "/equipamentos/create/Arma"], async (req: Request, res: Response) => {
  try {
    const {
      fichaId, nome, preco, dadoDeDano, alcance,
      peso, tipoDano, atributo, tipoArma, critico, pericia, multiplicador, descricao, equiped
    } = req.body;
    const arma = await prisma.arma.create({
      data: {
        fichaId: Number(fichaId),
        atributo,
        pericia,
        nome,
        peso: Number(peso),
        alcance,
        preco: Number(preco),
        tipoDano,
        descricao,
        critico: Number(critico),
        tipoArma,
        multiplicador: Number(multiplicador),
        dadoDeDano,
        equiped: equiped !== undefined ? Boolean(equiped) : false
      }
    })
    res.status(201).json({ message: "Arma criada com sucesso", data: arma })
  } catch (err) {
    res.status(400).json({ Error: err, ErrorMessage: "Erro ao tentar adicionar arma" })
  }
})

Router.get(["/equipamentos/listAll/Armas/:fichaId", "/equipamentos/listAll/Arma/:fichaId"], async (req: Request, res: Response) => {
  const { fichaId } = req.params;
  const id = parseInt(`${fichaId}`)

  try {
    const armas = await prisma.arma.findMany({
      where: {
        fichaId: id
      }
    })
    return res.status(200).json({ message: "Armas listadas com sucesso", data: armas })
  } catch (err) {
    return res.status(400).json({ Error: err, ErrorMessage: "Erro ao listar armas" })
  }
})

Router.get(["/equipamentos/get/Armas/:armaId", "/equipamentos/get/Arma/:armaId"], async (req: Request, res: Response) => {
  const { armaId } = req.params;
  const id = parseInt(`${armaId}`);
  try {
    const arma = await prisma.arma.findUnique({
      where: { id }
    });
    if (!arma) return res.status(404).json({ ErrorMessage: "Arma nao encontrada" });
    return res.status(200).json({ message: "Arma encontrada com sucesso", data: arma });
  } catch (err) {
    return res.status(400).json({ Error: err, ErrorMessage: "Erro ao buscar arma" });
  }
});

Router.put(["/equipamentos/update/Armas/:armaId", "/equipamentos/update/Arma/:armaId"], async (req: Request, res: Response) => {
  const { armaId } = req.params;
  const id = parseInt(`${armaId}`)
  const {
    nome, preco, dadoDeDano, alcance, peso, tipoDano, tipoArma,
    critico, multiplicador, atributo, descricao, pericia, equiped
  } = req.body;

  const data: any = {};
  if (nome !== undefined) data.nome = nome;
  if (preco !== undefined) data.preco = Number(preco);
  if (dadoDeDano !== undefined) data.dadoDeDano = dadoDeDano;
  if (alcance !== undefined) data.alcance = alcance;
  if (peso !== undefined) data.peso = Number(peso);
  if (tipoDano !== undefined) data.tipoDano = tipoDano;
  if (tipoArma !== undefined) data.tipoArma = tipoArma;
  if (critico !== undefined) data.critico = Number(critico);
  if (multiplicador !== undefined) data.multiplicador = Number(multiplicador);
  if (atributo !== undefined) data.atributo = atributo;
  if (descricao !== undefined) data.descricao = descricao;
  if (pericia !== undefined) data.pericia = pericia;
  if (equiped !== undefined) data.equiped = Boolean(equiped);

  try {
    const arma = await prisma.arma.update({
      where: { id },
      data
    })
    res.status(200).json({ message: "Arma atualizada com sucesso", data: arma })
  } catch (err) {
    console.log(err)
    res.status(400).json({ Error: err, ErrorMessage: "Erro ao tentar atualizar arma" })
  }
})

Router.delete(["/equipamentos/delete/Armas/:armaId", "/equipamentos/delete/Arma/:armaId"], async (req: Request, res: Response) => {
  const { armaId } = req.params;
  const id = parseInt(`${armaId}`)
  try {
    const ArmaDeletada = await prisma.arma.delete({
      where: {
        id
      }
    })
    res.status(200).json({ message: "Arma deletada com sucesso", ArmaDeletada })
  } catch (err) {
    res.status(400).json({ Error: err, ErrorMessage: "Erro ao tentar deletar arma" })
  }
})

// --- PROTEÇÕES ---
Router.post(["/equipamentos/create/Protecao", "/equipamentos/create/Protecoes"], async (req: Request, res: Response) => {
  try {
    const { fichaId, tipoProtecao, penalidade, nomeProtecao, preco, peso, descricao, bonus, equipada } = req.body;
    const protecao = await prisma.protecao.create({
      data: {
        fichaId: Number(fichaId),
        nomeProtecao,
        peso: Number(peso),
        penalidade: Number(penalidade),
        preco: Number(preco),
        descricao,
        bonus: Number(bonus),
        tipoProtecao,
        equipada: equipada !== undefined ? Boolean(equipada) : false
      }
    })
    res.status(201).json({ message: "Protecao criada com sucesso", data: protecao })
  } catch (err) {
    res.status(400).json({ Error: err, ErrorMessage: "Erro ao tentar adicionar protecao" })
  }
})

Router.get(["/equipamentos/listAll/Protecao/:fichaId", "/equipamentos/listAll/Protecoes/:fichaId"], async (req: Request, res: Response) => {
  const { fichaId } = req.params;
  const id = parseInt(`${fichaId}`)

  try {
    const protecoes = await prisma.protecao.findMany({
      where: {
        fichaId: id
      }
    })
    return res.status(200).json({ message: "Protecoes listadas com sucesso", data: protecoes })
  } catch (err) {
    return res.status(400).json({ Error: err, ErrorMessage: "Erro ao listar protecoes" })
  }
})

Router.get(["/equipamentos/get/Protecao/:id", "/equipamentos/get/Protecoes/:id"], async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const protecao = await prisma.protecao.findUnique({
      where: { id: Number(id) }
    });
    if (!protecao) return res.status(404).json({ ErrorMessage: "Protecao nao encontrada" });
    return res.status(200).json({ message: "Protecao encontrada com sucesso", data: protecao });
  } catch (err) {
    return res.status(400).json({ Error: err, ErrorMessage: "Erro ao buscar protecao" });
  }
});

Router.put(["/equipamentos/update/Protecao/:id", "/equipamentos/update/Protecoes/:id"], async (req: Request, res: Response) => {
  const { id } = req.params;
  const protecaoId = parseInt(`${id}`);
  const { nomeProtecao, preco, bonus, penalidade, peso, tipoProtecao, equipada, descricao } = req.body;

  const data: any = {};
  if (nomeProtecao !== undefined) data.nomeProtecao = nomeProtecao;
  if (preco !== undefined) data.preco = Number(preco);
  if (bonus !== undefined) data.bonus = Number(bonus);
  if (penalidade !== undefined) data.penalidade = Number(penalidade);
  if (peso !== undefined) data.peso = Number(peso);
  if (tipoProtecao !== undefined) data.tipoProtecao = tipoProtecao;
  if (equipada !== undefined) data.equipada = Boolean(equipada);
  if (descricao !== undefined) data.descricao = descricao;

  try {
    const protecao = await prisma.protecao.update({
      where: { id: protecaoId },
      data
    });
    res.status(200).json({ message: "Protecao atualizada com sucesso", data: protecao });
  } catch (err) {
    console.log(err);
    res.status(400).json({ Error: err, ErrorMessage: "Erro ao tentar atualizar protecao" });
  }
});

Router.delete(["/equipamentos/delete/Protecao/:id", "/equipamentos/delete/Protecoes/:id"], async (req: Request, res: Response) => {
  const { id } = req.params;
  const protecaoId = parseInt(`${id}`)
  try {
    const ProtecaoDeletada = await prisma.protecao.delete({
      where: {
        id: protecaoId
      }
    })
    res.status(200).json({ message: "Protecao deletada com sucesso", ProtecaoDeletada })
  } catch (err) {
    res.status(400).json({ Error: err, ErrorMessage: "Erro ao tentar deletar protecao" })
  }
})

// --- ITENS GERAIS ---
Router.post("/equipamentos/create/Geral", async (req: Request, res: Response) => {
  try {
    const { fichaId, tipoItemGeral, preco } = req.body;
    const geral = await prisma.geral.create({
      data: {
        fichaId: Number(fichaId),
        tipoItemGeral,
        preco: Number(preco)
      }
    });
    res.status(201).json({ message: "Item Geral criado com sucesso", data: geral });
  } catch (err) {
    res.status(400).json({ Error: err, ErrorMessage: "Erro ao tentar adicionar item geral" });
  }
});

Router.get("/equipamentos/listAll/Geral/:fichaId", async (req: Request, res: Response) => {
  const { fichaId } = req.params;
  try {
    const gerais = await prisma.geral.findMany({
      where: { fichaId: Number(fichaId) }
    });
    return res.status(200).json({ message: "Itens Gerais listados com sucesso", data: gerais });
  } catch (err) {
    return res.status(400).json({ Error: err, ErrorMessage: "Erro ao listar itens gerais" });
  }
});

Router.get("/equipamentos/get/Geral/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const geral = await prisma.geral.findUnique({
      where: { id: Number(id) }
    });
    if (!geral) return res.status(404).json({ ErrorMessage: "Item Geral nao encontrado" });
    return res.status(200).json({ message: "Item Geral encontrado com sucesso", data: geral });
  } catch (err) {
    return res.status(400).json({ Error: err, ErrorMessage: "Erro ao buscar item geral" });
  }
});

Router.put("/equipamentos/update/Geral/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tipoItemGeral, preco } = req.body;
  const data: any = {};
  if (tipoItemGeral !== undefined) data.tipoItemGeral = tipoItemGeral;
  if (preco !== undefined) data.preco = Number(preco);

  try {
    const geral = await prisma.geral.update({
      where: { id: Number(id) },
      data
    });
    res.status(200).json({ message: "Item Geral atualizado com sucesso", data: geral });
  } catch (err) {
    res.status(400).json({ Error: err, ErrorMessage: "Erro ao tentar atualizar item geral" });
  }
});

Router.delete("/equipamentos/delete/Geral/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const geralDeletado = await prisma.geral.delete({
      where: { id: Number(id) }
    });
    res.status(200).json({ message: "Item Geral deletado com sucesso", geralDeletado });
  } catch (err) {
    res.status(400).json({ Error: err, ErrorMessage: "Erro ao tentar deletar item geral" });
  }
});

// --- ITENS (MODEL ITEM) ---
Router.post(["/equipamentos/create/Item", "/equipamentos/create/Itens"], async (req: Request, res: Response) => {
  try {
    const { fichaId, nome, peso, descricao } = req.body;
    const data: any = {
      nome,
      peso: Number(peso),
      descricao
    };
    if (fichaId !== undefined && fichaId !== null) {
      data.fichaId = Number(fichaId);
    }
    const item = await prisma.item.create({
      data
    });
    res.status(201).json({ message: "Item criado com sucesso", data: item });
  } catch (err) {
    res.status(400).json({ Error: err, ErrorMessage: "Erro ao tentar criar item" });
  }
});

Router.get(["/equipamentos/listAll/Item/:fichaId", "/equipamentos/listAll/Itens/:fichaId"], async (req: Request, res: Response) => {
  const { fichaId } = req.params;
  try {
    const items = await prisma.item.findMany({
      where: { fichaId: Number(fichaId) }
    });
    return res.status(200).json({ message: "Itens listados com sucesso", data: items });
  } catch (err) {
    return res.status(400).json({ Error: err, ErrorMessage: "Erro ao listar itens" });
  }
});

Router.get(["/equipamentos/get/Item/:id", "/equipamentos/get/Itens/:id"], async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const item = await prisma.item.findUnique({
      where: { id: Number(id) }
    });
    if (!item) return res.status(404).json({ ErrorMessage: "Item nao encontrado" });
    return res.status(200).json({ message: "Item encontrado com sucesso", data: item });
  } catch (err) {
    return res.status(400).json({ Error: err, ErrorMessage: "Erro ao buscar item" });
  }
});

Router.put(["/equipamentos/update/Item/:id", "/equipamentos/update/Itens/:id"], async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, peso, descricao, fichaId } = req.body;
  const data: any = {};
  if (nome !== undefined) data.nome = nome;
  if (peso !== undefined) data.peso = Number(peso);
  if (descricao !== undefined) data.descricao = descricao;
  if (fichaId !== undefined) data.fichaId = fichaId !== null ? Number(fichaId) : null;

  try {
    const item = await prisma.item.update({
      where: { id: Number(id) },
      data
    });
    res.status(200).json({ message: "Item atualizado com sucesso", data: item });
  } catch (err) {
    res.status(400).json({ Error: err, ErrorMessage: "Erro ao tentar atualizar item" });
  }
});

Router.delete(["/equipamentos/delete/Item/:id", "/equipamentos/delete/Itens/:id"], async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const itemDeletado = await prisma.item.delete({
      where: { id: Number(id) }
    });
    res.status(200).json({ message: "Item deletado com sucesso", itemDeletado });
  } catch (err) {
    res.status(400).json({ Error: err, ErrorMessage: "Erro ao tentar deletar item" });
  }
});

// --- LISTAR TODOS OS EQUIPAMENTOS DA FICHA ---
Router.get("/equipamentos/listAll/:fichaId", async (req: Request, res: Response) => {
  const { fichaId } = req.params;
  const id = Number(fichaId);
  try {
    const [armas, protecoes, gerais, items] = await Promise.all([
      prisma.arma.findMany({ where: { fichaId: id } }),
      prisma.protecao.findMany({ where: { fichaId: id } }),
      prisma.geral.findMany({ where: { fichaId: id } }),
      prisma.item.findMany({ where: { fichaId: id } })
    ]);
    return res.status(200).json({
      message: "Todos os equipamentos listados com sucesso",
      data: {
        armas,
        protecoes,
        gerais,
        items
      }
    });
  } catch (err) {
    return res.status(400).json({ Error: err, ErrorMessage: "Erro ao listar todos os equipamentos" });
  }
});


Router.post("/magias/create/", async (req: Request, res: Response) => {
  const { nome, execucao, alcance, alvo,
    duracao, truque, tipoMagia, gastoPe, descricao, Circulo, fichaId
  } = req.body;
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
        fichaId: Number(fichaId)
      }
    })
    res.status(200).json({ Sucess: "Sucesso, magia criada com sucesso", data: magia })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ Error: err, ErrorMessage: "Erro nao foi possivel criar magia" })
  }
})

Router.put("/magia/update/:magiaId/:fichaId", async (req: Request, res: Response) => {
  const { magiaId, fichaId } = req.params;
  const data: Magias = req.body;

  try {
    const magias = await prisma.magia.update({
      where: {
        id: Number(magiaId),
        fichaId: Number(fichaId)
      },
      data
    })
    res.status(200).json({ Sucesso: "Sucesso", magias })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ Err: err, ErroMessage: "Erro ao tentar editar magias tente novamente mais tarde." });
  }
})

Router.delete("/magias/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const magiaId = parseInt(`${id}`)

  try {
    const magia = await prisma.magia.delete({
      where: {
        id: magiaId
      }
    })
    res.status(200).json({ Sucess: "Sucesso, magia criada com sucesso", data: magia })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ Error: err, ErrorMessage: "Erro nao foi possivel criar magia" })
  }
})

Router.get("/magias/list/:fichaId", async (req: Request, res: Response) => {
  const { fichaId } = req.params;
  try {
    const magias = await prisma.magia.findMany({
      where: { fichaId: Number(fichaId) }
    })
    console.log(magias)
    res.status(200).json({ Sucesso: "Sucesso magias listadas com sucesso", magias })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ Erro: err, ErroMessage: "Erro ao listar magias" })
  }
})



// Habilidades
Router.post("/habilidades/create/", async (req: Request, res: Response) => {
  const { nome, descricao, classe, gastoPe, fichaId } = req.body;
  try {
    const habilidade = await prisma.habilidade.create({
      data: {
        nome,
        classe,
        descricao,
        gastoPe,
        fichaId
      }
    })
    res.status(200).json({ Sucess: "Sucesso, habilidade criada com sucesso", data: habilidade })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ Error: err, ErrorMessage: "Erro nao foi possivel criar habilidade" })
  }
})

Router.post("/habilidades/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const habilidadeId = parseInt(`${id}`)

  try {
    const habilidade = await prisma.habilidade.delete({
      where: {
        id: habilidadeId
      }
    })
    res.status(200).json({ Sucess: "Sucesso, habilidade deletada com sucesso", data: habilidade })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ Error: err, ErrorMessage: "Erro nao foi possivel deletar habilidade" })
  }
})

Router.put("/habilidades/update/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const habilidadeId = parseInt(`${id}`)
  const { nome, descricao, gastoPe, fichaId, classe } = req.body;
  const data: { nome?: string, descricao?: string, gastoPe?: number, fichaId?: number, classe?: string } = {};
  if (nome !== undefined) data.nome = nome;
  if (descricao !== undefined) data.descricao = descricao;
  if (gastoPe !== undefined) data.gastoPe = gastoPe;
  if (fichaId !== undefined) data.fichaId = Number(fichaId);
  if (classe !== undefined) data.classe = classe;
  try {
    const habilidade = await prisma.habilidade.update({
      where: { id: habilidadeId },
      data
    })
    res.status(200).json({ Sucess: "Sucesso, habilidade atualizada com sucesso", data: habilidade })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ Error: err, ErrorMessage: "Erro nao foi possivel atualizar habilidade" })
  }
})

Router.get("/habilidades/list/:fichaId", async (req: Request, res: Response) => {
  const { fichaId } = req.params;
  try {
    const habilidades = await prisma.habilidade.findMany({
      where: { fichaId: Number(fichaId) }
    })
    res.status(200).json({ Sucesso: "Sucesso habilidades listadas com sucesso", habilidades })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ Erro: err, ErroMessage: "Erro ao listar habilidades" })
  }
})

Router.get("/pericias/list/:fichaId", async (req: Request, res: Response) => {
  const { fichaId } = req.params;
  try {
    const pericias = await prisma.pericia.findMany({
      where: {
        fichaId: Number(fichaId)
      },
      select: { fichaId: true, id: true, treino: true, outros: true, metadeDoNivel: true, atributo: true, nome: true }
    })
    res.status(200).json({ Sucess: "Pericia atualizada  com sucesso", pericias })
  } catch (err) {
    console.log(err)
    res.status(400).json({ Erro: err, ErrorMessage: "Erro ao listar pericias" })
  }

})

Router.put("/pericias/update/:periciaId", async (req: Request, res: Response) => {
  const { periciaId } = req.params;
  const data: Pericias = req.body;
  try {
    const pericias = await prisma.pericia.update({
      where: { id: Number(periciaId) },
      data
    })
    console.log(pericias)
    res.status(200).json({ Sucess: "Pericia atualizada  com sucesso", pericias })

  } catch (err) {
    console.log(err)
    res.status(400).json({ Error: err, ErrorMessage: "Erro ao criar as pericias" })
  }
})

Router.post("/protecoes/create/:fichaId", async (req: Request, res: Response) => {
  const { preco, nomeProtecao, penalidade, peso, equipada, descricao, tipoProtecao, bonus } = req.body;
  const { fichaId } = req.params;
  try {
    const protecao = await prisma.protecao.create({
      data: {
        preco,
        nomeProtecao,
        penalidade,
        peso,
        equipada,
        descricao,
        tipoProtecao,
        bonus,
        fichaId: Number(fichaId)
      }
    })
    console.log(protecao)
    return res.status(200).json({ Sucess: "Sucesso ao criar protecao", protecao })
  } catch (err) { return res.status(400).json({ Erro: err, ErroMessage: "Erro ao criar protecao,tente novamente mais tarde" }) }

})

Router.post("/protecoes/atualize/equiped/:id", async (req: Request, res: Response) => {
  const { equiped } = req.body;
  const { id } = req.params;

  try {
    const protecao = await prisma.protecao.update({
      where: { id: Number(id) },
      data: { equipada: equiped }
    })
    console.log(protecao)
    return res.status(200).json({ Sucess: "Sucesso ao criar protecao", protecao })
  } catch (err) { return res.status(400).json({ Erro: err, ErroMessage: "Erro ao criar protecao,tente novamente mais tarde" }) }

})

//Campanhas
Router.post("/campanha/create/", async (req: Request, res: Response) => {
  const { nomeCampanha, playerMasterId } = req.body;
  const chaveLink = crypto.randomUUID();
  try {
    let findPlayer = await prisma.user.findUnique({
      where: {
        id: playerMasterId
      }
    })
    console.log(findPlayer)
    if (findPlayer) {
      const campanha = await prisma.campanha.create({
        data: {
          nomeCampanha, chaveLink, playerMestreId: Number(playerMasterId),
          players: { connect: { id: playerMasterId } }
        }
      })
      console.log(campanha)
      return res.status(200).json({ Sucess: "Sucesso ao criar campanha", campanha })
    } else return res.status(400).json({ ErroMessage: "Erro ao achar usuario mestre,tente novamente mais tarde" })

  } catch (err) { return res.status(400).json({ Erro: err, ErroMessage: "Erro ao criar campanha,tente novamente mais tarde" }) }
})

Router.get("/campanha/listMestre/:playerMestreId", async (req: Request, res: Response) => {
  const { playerMestreId } = req.params;
  try {
    const campanhas = await prisma.campanha.findMany({
      where: {
        playerMestreId: Number(playerMestreId)
      }
    })
    console.log(campanhas)
    return res.status(200).json({ Sucess: "Sucesso ao listar campanhas", campanhas })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ Erro: err, ErroMessage: "Erro ao listar as campanhas" })
  }
})

Router.get("/campanha/list/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const campanhas = await prisma.user.findMany({
      where: { id: Number(id) },
      select: { campanhas: true }
    })
    console.log(campanhas)
    return res.status(200).json({ Sucess: "Sucesso ao listar campanhas", campanhas })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ Erro: err, ErroMessage: "Erro ao listar as campanhas" })
  }
})



Router.delete("/campanha/delete/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const campanhaDeletada = await prisma.campanha.delete({
      where: {
        id: Number(id)
      }
    })
    return res.status(200).json({ Sucesso: "Deletado com sucesso", campanhaDeletada })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ Erro: err, ErroMessage: "Erro ao deletar campanha" })
  }
})

Router.post("/campanha/find/:chaveLink", async (req: Request, res: Response) => {
  const { chaveLink } = req.params;
  const { userId } = req.body;
  const chave = `${chaveLink}`
  try {
    const campanhaFinded = await prisma.campanha.findFirst({
      where: {
        chaveLink: chave
      }
    })

    if (!campanhaFinded) return res.status(400).json({ ErroMessage: "Erro fiquei com preguica" })

    const campanha = await prisma.campanha.update({
      where: { id: campanhaFinded.id },
      data: { players: { connect: { id: userId } } }
    })
    console.log(campanha)
    return res.status(200).json({ Sucesso: "Inscrito na campanha cm sucesso", campanhaFinded })
  } catch (err) {
    console.log(err)
    return res.status(400).json({ Erro: err, ErroMessage: "Erro fiquei com preguica" })
  }
})

Router.get("/campanha/list/players/:campanhaId", async (req: Request, res: Response) => {
  const { campanhaId } = req.params;

  try {
    const players = await prisma.campanha.findMany({
      where: { id: Number(campanhaId) },
      select: { players: true, id: true }
    })
    return res.status(200).json({ Sucess: "Listado com sucesso", players })
  } catch (err) {
    return res.status(400).json({ Erro: err })
  }
})


Router.delete("/campanha/mestre/remove/:playerId/:campanhaId", async (req: Request, res: Response) => {
  const { playerId, campanhaId } = req.params;
  try {
    const players = await prisma.campanha.update({
      where: { id: Number(campanhaId) },
      data: {
        players: { disconnect: { id: Number(playerId) } }
      }
    })
    return res.status(200).json({ Sucess: "Removido com sucesso", players })
  } catch (err) {
    return res.status(400).json({ Erro: err })
  }
})

Router.get("/campanha/mestre/list/fichas/:campanhaId", async (req: Request, res: Response) => {
  const { campanhaId } = req.params
  try {

    const fichas = await prisma.campanha.findFirst({
      where: { id: Number(campanhaId) },
      select: { fichas: true }
    })

    return res.status(200).json({ Sucess: "Listadas com sucesso", fichas })
  } catch (err) {
    return res.status(400).json({ Erro: err })
  }
})

Router.post("/ficha/add/:campanhaId/:fichaId", async (req: Request, res: Response) => {
  const { campanhaId, fichaId } = req.params;
  try {
    const campanhaFicha = await prisma.campanha.update({
      where: { id: Number(campanhaId) },
      data: { fichas: { connect: { id: Number(fichaId) } } }
    })
    console.log(campanhaFicha)
    res.status(200).json({ Sucess: "Ficha adicionada com sucess", campanhaFicha })
  } catch (err) {
    console.log(err)
    res.status(400).json({ Err: err, ErroMessage: "Erro ao adicionar ficha" })
  }
})


Router.delete("/ficha/remove/:campanhaId/:fichaId", async (req: Request, res: Response) => {
  const { campanhaId, fichaId } = req.params;
  try {
    const campanhaFicha = await prisma.campanha.update({
      where: { id: Number(campanhaId) },
      data: { fichas: { disconnect: { id: Number(fichaId) } } }
    })
    console.log(campanhaFicha)
    res.status(200).json({ Sucess: "Ficha removida com sucess", campanhaFicha })
  } catch (err) {
    console.log(err)
    res.status(400).json({ Err: err, ErroMessage: "Erro ao remover ficha" })
  }
})

Router.post("/historico/create/:fichaId", async (req: Request, res: Response) => {
  const { value } = req.body;
  const { fichaId } = req.params;
  try {
    const historico = await prisma.historico.create({
      data: {
        fichaId: Number(fichaId),
        value
      }
    })
    console.log("Sucesso",)
    return res.status(200).json({ Sucess: "Historico adicionado com sucesso", historico })

  } catch (err) {
    console.log(err)
    res.status(400).json({ Erro: err, ErroMessage: "Erro ao adicionar historico" })

  }
})

Router.put("/historico/update/:id", async (req: Request, res: Response) => {
  const { value } = req.body;
  const { id } = req.params;
  try {
    const historico = await prisma.historico.update({
      where: {
        id: Number(id),
      },
      data: {
        value
      }
    })
    console.log("Sucesso",)
    return res.status(200).json({ Sucess: "Historico atualizado com sucesso", historico })

  } catch (err) {
    console.log(err)
    res.status(400).json({ Erro: err, ErroMessage: "Erro ao atualizado historico" })
  }
})

Router.get("/historico/list/:fichaId", async (req: Request, res: Response) => {
  const { fichaId } = req.params;
  try {
    const historico = await prisma.historico.findMany({
      where: { fichaId: Number(fichaId), }
    })
    console.log("Sucesso",)
    return res.status(200).json({ Sucess: "Historico listado com sucesso", historico })

  } catch (err) {
    console.log(err)
    res.status(400).json({ Erro: err, ErroMessage: "Erro ao listar historico" })
  }
})




Router.delete("/historico/delete/:historicoId", async (req: Request, res: Response) => {
  const { historicoId } = req.params;
  try {
    const historico = await prisma.historico.delete({
      where: {
        id: Number(historicoId),
      }
    })
    console.log("Sucesso,historico deletado", historico)
    return res.status(200).json({ Sucess: "Historico deletado com sucesso", historico })

  } catch (err) {
    console.log(err)
    res.status(400).json({ Erro: err, ErroMessage: "Erro ao deletar historico" })

  }
})


export default Router;

