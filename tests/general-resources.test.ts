import assert from "node:assert/strict";
import test from "node:test";

process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/test";
const { prisma } = await import("../src/prisma.ts");
const { default: pericias } = await import("../src/modules/route.pericia.ts");
const { default: habilidades } = await import("../src/modules/route.habilidade.ts");
const { default: accounts } = await import("../src/modules/route.accounts.ts");

function stub(t: any, target: any, key: string, implementation: (...args: any[]) => unknown) {
  const original = target[key];
  target[key] = implementation;
  t.after(() => { target[key] = original; });
}

async function request(router: any, method: string, path: string, body: object = {}, params: object = {}) {
  const layer = router.stack.find((entry: any) => entry.route?.methods[method] && entry.route.path.includes(path));
  assert.ok(layer, `Rota ausente: ${method} ${path}`);
  let status = 200;
  let response: any;
  const res = { status(value: number) { status = value; return this; }, json(value: unknown) { response = value; return this; } };
  await layer.route.stack[0].handle({ body, params }, res, () => {});
  return { status, body: response };
}

test("perícia geral cria na tabela correta e aceita fichaId como alias", async t => {
  let args: any;
  stub(t, prisma.periciasFichaGeral, "create", async (value: any) => { args = value; return { id: 1, ...value.data }; });
  stub(t, prisma.pericia, "create", () => { throw new Error("Tabela errada"); });
  const result = await request(pericias, "post", "/pericias/create/:sistema",
    { nome: "Investigação", atributo: "Intelecto", treino: 0, outros: -2, fichaId: "9", metadeDoNivel: 10, id: 123 }, { sistema: "geral" });
  assert.equal(result.status, 201);
  assert.deepEqual(args.data, { nome: "Investigação", atributo: "Intelecto", treino: 0, outros: -2, fichaGeralId: 9 });
});

test("URL antiga de perícia mantém Tormenta20 e atualização parcial", async t => {
  let args: any;
  stub(t, prisma.pericia, "update", async (value: any) => { args = value; return { id: 1 }; });
  const result = await request(pericias, "put", "/pericias/update/:periciaId", { treino: 0 }, { periciaId: "1" });
  assert.equal(result.status, 200);
  assert.deepEqual(args, { where: { id: 1 }, data: { treino: 0 } });
});

test("listagem de perícias gerais filtra por fichaGeralId", async t => {
  let args: any;
  stub(t, prisma.periciasFichaGeral, "findMany", async (value: any) => { args = value; return []; });
  const result = await request(pericias, "get", "/pericias/list/:fichaId/:sistema", {}, { fichaId: "9", sistema: "geral" });
  assert.deepEqual(args, { where: { fichaGeralId: 9 } });
  assert.deepEqual(result.body.pericias, []);
});

test("habilidade geral usa custo e não gastoPe/classe", async t => {
  let args: any;
  stub(t, prisma.habilidadeFichaGeral, "create", async (value: any) => { args = value; return { id: 2 }; });
  const result = await request(habilidades, "post", "/habilidades/create/:sistema",
    { nome: "Magia", descricao: "Efeito", custo: 0, fichaGeralId: 9, gastoPe: 4, classe: "Mago" }, { sistema: "geral" });
  assert.equal(result.status, 200);
  assert.deepEqual(args.data, { nome: "Magia", descricao: "Efeito", custo: 0, fichaGeralId: 9 });
});

test("habilidade geral permite remover o custo sem apagar outros campos", async t => {
  let args: any;
  stub(t, prisma.habilidadeFichaGeral, "update", async (value: any) => { args = value; return { id: 2 }; });
  await request(habilidades, "put", "/habilidades/update/:id/:sistema", { custo: null }, { id: "2", sistema: "geral" });
  assert.deepEqual(args, { where: { id: 2 }, data: { custo: null } });
});

test("criação antiga de habilidade mantém campos de Tormenta20", async t => {
  let args: any;
  stub(t, prisma.habilidade, "create", async (value: any) => { args = value; return { id: 2 }; });
  await request(habilidades, "post", "/habilidades/create", { nome: "Poder", descricao: "", classe: "Geral", gastoPe: 0, fichaId: 9 });
  assert.deepEqual(args.data, { nome: "Poder", descricao: "", classe: "Geral", gastoPe: 0, fichaId: 9 });
});

test("exclusão de habilidade geral não acessa tabela Tormenta20", async t => {
  stub(t, prisma.habilidade, "delete", () => { throw new Error("Tabela errada"); });
  let args: any;
  stub(t, prisma.habilidadeFichaGeral, "delete", async (value: any) => { args = value; return { id: 2 }; });
  const result = await request(habilidades, "post", "/habilidades/delete/:id/:sistema", {}, { id: "2", sistema: "geral" });
  assert.equal(result.status, 200);
  assert.deepEqual(args, { where: { id: 2 } });
});

test("contador assume valor zero e tipo bar na criação", async t => {
  let args: any;
  stub(t, prisma.accountants, "create", async (value: any) => { args = value; return { id: 3 }; });
  const result = await request(accounts, "post", "/accounts/create", { name: "Vida", fichaId: 9 });
  assert.equal(result.status, 201);
  assert.deepEqual(args.data, { name: "Vida", value: 0, accontantType: "bar", fichaGeralId: 9 });
});

test("atualizar contador para zero preserva nome, tipo e ficha", async t => {
  let args: any;
  stub(t, prisma.accountants, "update", async (value: any) => { args = value; return { id: 3 }; });
  await request(accounts, "put", "/accounts/update/:id/:sistema", { value: 0 }, { id: "3", sistema: "geral" });
  assert.deepEqual(args, { where: { id: 3 }, data: { value: 0 } });
});

test("contadores permitem listar e excluir no sistema geral", async t => {
  stub(t, prisma.accountants, "findMany", async (value: any) => { assert.deepEqual(value.where, { fichaGeralId: 9 }); return [{ id: 3 }]; });
  stub(t, prisma.accountants, "delete", async (value: any) => { assert.deepEqual(value.where, { id: 3 }); return { id: 3 }; });
  assert.equal((await request(accounts, "get", "/accounts/list/:fichaId", {}, { fichaId: "9" })).body.accounts.length, 1);
  assert.equal((await request(accounts, "delete", "/accounts/delete/:id", {}, { id: "3" })).status, 200);
});

test("sistema desconhecido, ID inválido e campos incompletos são rejeitados antes do Prisma", async t => {
  stub(t, prisma.periciasFichaGeral, "create", () => { throw new Error("Não deve consultar o banco"); });
  assert.equal((await request(pericias, "post", "/pericias/create/:sistema", {}, { sistema: "inexistente" })).status, 400);
  assert.equal((await request(pericias, "post", "/pericias/create/:sistema", { nome: "X" }, { sistema: "geral" })).status, 400);
  assert.equal((await request(pericias, "put", "/pericias/update/:periciaId/:sistema", { treino: 1 }, { periciaId: "1abc", sistema: "geral" })).status, 400);
  assert.equal((await request(accounts, "post", "/accounts/create/:sistema", { name: "Vida", fichaId: 1 }, { sistema: "tormenta" })).status, 400);
});

test("registro ausente e vínculo inexistente retornam 404", async t => {
  stub(t, prisma.habilidadeFichaGeral, "update", async () => { throw { code: "P2025" }; });
  stub(t, prisma.accountants, "create", async () => { throw { code: "P2003" }; });
  assert.equal((await request(habilidades, "put", "/habilidades/update/:id/:sistema", { custo: 1 }, { id: "99", sistema: "geral" })).status, 404);
  assert.equal((await request(accounts, "post", "/accounts/create", { name: "Vida", fichaId: 99 })).status, 404);
});
