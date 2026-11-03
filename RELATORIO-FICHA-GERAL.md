# Backend: perícias, habilidades e contadores da ficha geral

## Implementação

As rotas de perícias e habilidades agora aceitam o sistema no último segmento da URL. Cada operação usa `switch (getSystem(req))` para encaminhar a consulta ao modelo Prisma correto:

| Recurso | Tormenta20 | Geral |
| --- | --- | --- |
| Perícias | `prisma.pericia` | `prisma.periciasFichaGeral` |
| Habilidades | `prisma.habilidade` | `prisma.habilidadeFichaGeral` |
| Contadores (`accounts`) | Indisponível | `prisma.accountants` |

Sem o segmento de sistema, perícias e habilidades continuam usando `tormenta`. Também é possível usar `/tormenta` explicitamente. Os contadores usam `geral` por padrão e rejeitam `tormenta`.

Os vínculos gerais usam `fichaGeralId`. O corpo também aceita `fichaId` como alias, para facilitar o consumo pelas funções existentes do cliente. Quando ambos estão presentes, `fichaGeralId` tem prioridade. Os IDs dos registros são sempre consultados dentro do modelo do sistema informado.

## Rotas

| Método | URL da ficha geral | Resposta principal |
| --- | --- | --- |
| POST | `/pericias/create/geral` | `pericias` (registro criado), HTTP 201 |
| PUT | `/pericias/update/:periciaId/geral` | `pericias` (registro atualizado) |
| GET | `/pericias/list/:fichaId/geral` | `pericias` (lista) |
| POST | `/habilidades/create/geral` | `data` (registro criado), HTTP 200 por compatibilidade |
| PUT | `/habilidades/update/:id/geral` | `data` (registro atualizado) |
| GET | `/habilidades/list/:fichaId/geral` | `habilidades` (lista) |
| POST | `/habilidades/delete/:id/geral` | `data` (registro excluído) |
| POST | `/accounts/create/geral` | `data` (registro criado), HTTP 201 |
| PUT | `/accounts/update/:id/geral` | `data` (registro atualizado) |
| GET | `/accounts/list/:fichaId/geral` | `accounts` (lista) |
| DELETE | `/accounts/delete/:id/geral` | `data` (registro excluído) |

O segmento `/geral` é opcional somente nas rotas de contadores. Todas as rotas acima são registradas no roteador central existente; o prefixo de montagem da aplicação continua sendo o mesmo.

## Exemplos de criação

`POST /pericias/create/geral`

```json
{
  "nome": "Investigação",
  "atributo": "Intelecto",
  "treino": 2,
  "outros": 0,
  "fichaGeralId": 9
}
```

`POST /habilidades/create/geral`

```json
{
  "nome": "Sentidos aguçados",
  "descricao": "Descrição do efeito da habilidade.",
  "custo": 2,
  "fichaGeralId": 9
}
```

`POST /accounts/create/geral`

```json
{
  "name": "Vida",
  "value": 20,
  "accontantType": "bar",
  "fichaGeralId": 9
}
```

Os contadores correspondem ao campo `accounts` e ao modelo `Accountants` já existentes em `fichaGeral.prisma`. A grafia `accontantType` foi preservada para corresponder ao schema. Na criação, `value` assume `0` e `accontantType` assume `bar` quando omitidos. Nenhum conjunto novo de tipos foi imposto: o tipo continua sendo uma string, como no schema.

## Edição e validação

- Os PUTs aceitam atualização parcial. Exemplo: `{ "value": 0 }` altera somente o valor do contador.
- Habilidades gerais usam `custo`; habilidades de Tormenta20 usam `gastoPe` e `classe`.
- Perícias gerais não recebem `metadeDoNivel`; esse campo pertence à ficha Tormenta20.
- Valores zero e modificadores negativos são preservados. `custo` e `gastoPe` podem ser `null`.
- IDs precisam ser inteiros positivos. Campos de texto obrigatórios são validados com Zod, e campos não previstos são descartados.
- O helper `definedData` remove campos `undefined` antes das atualizações, evitando sobrescrever valores ausentes e respeitando `exactOptionalPropertyTypes`.
- Dados ou sistemas inválidos retornam HTTP 400. Registro inexistente (`P2025`) ou vínculo inexistente (`P2003`) retorna HTTP 404.

## Arquivos

- `src/modules/route.pericia.ts`: criação e seleção de sistema na criação, edição e listagem.
- `src/modules/route.habilidade.ts`: seleção de sistema na criação, edição, listagem e exclusão.
- `src/modules/route.accounts.ts`: criação, edição, listagem e exclusão dos contadores gerais.
- `src/modules/resource.helpers.ts`: validação de IDs/sistemas, alias de ficha, remoção de campos indefinidos e tratamento de erros.
- `src/modules/routes.ts`: registro das rotas de contadores.
- `tests/general-resources.test.ts`: testes dos handlers com os métodos Prisma simulados.

## Verificação e alcance

O comando `npm run build` concluiu a geração do Prisma Client e a verificação TypeScript. Os 12 testes executados com `node --import tsx tests/general-resources.test.ts` passaram, cobrindo seleção de tabela, compatibilidade com rotas antigas, atualizações parciais, valores zero, contadores, validação e erros de registro/vínculo ausente.

Os testes executam os handlers com Prisma simulado, sem acesso ao banco real. A persistência em um banco de desenvolvimento e o fluxo HTTP completo ainda precisam de validação integrada.

Não foi necessária alteração no schema ou migração: os modelos já estavam definidos. O trabalho desta entrega está no backend; a ficha geral no frontend ainda usa os elementos locais implementados anteriormente e não passou a chamar essas rotas automaticamente.
