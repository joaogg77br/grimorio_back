import express, { type Request, type Response } from "express";
import userRoutes from "./route.user.js";
import personagemRoutes from "./route.personagem.js";
import armaRoutes from "./route.arma.js";
import protecaoRoutes from "./route.protecao.js";
import itemRoutes from "./route.item.js";
import equipamentoRoutes from "./route.equipamento.js";
import magiaRoutes from "./route.magia.js";
import habilidadeRoutes from "./route.habilidade.js";
import periciaRoutes from "./route.pericia.js";
import campanhaRoutes from "./route.campanha.js";
import historicoRoutes from "./route.historico.js";
import userLogin from "./route.login.js";

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
Router.use(campanhaRoutes);
Router.use(historicoRoutes);
Router.use(userLogin);

export default Router;
