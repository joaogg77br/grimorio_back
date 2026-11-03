import express, { type Request, type Response } from "express";
import userRoutes from "./route.user.ts";
import personagemRoutes from "./route.personagem.ts";
import armaRoutes from "./route.arma.ts";
import protecaoRoutes from "./route.protecao.ts";
import itemRoutes from "./route.item.ts";
import equipamentoRoutes from "./route.equipamento.ts";
import magiaRoutes from "./route.magia.ts";
import habilidadeRoutes from "./route.habilidade.ts";
import periciaRoutes from "./route.pericia.ts";
import accountsRoutes from "./route.accounts.ts";
import camposSimplesRoutes from "./route.camposSimples.ts";
import campanhaRoutes from "./route.campanha.ts";
import historicoRoutes from "./route.historico.ts";
import userLogin from "./route.login.ts";

const Router = express.Router();

Router.use(userRoutes);
Router.use(personagemRoutes);
Router.use(armaRoutes);
Router.use(protecaoRoutes);
Router.use(itemRoutes);
Router.use(equipamentoRoutes);
Router.use(magiaRoutes);
Router.use(habilidadeRoutes);
Router.use(periciaRoutes);
Router.use(accountsRoutes);
Router.use(camposSimplesRoutes);
Router.use(campanhaRoutes);
Router.use(historicoRoutes);
Router.use(userLogin);

export default Router;
