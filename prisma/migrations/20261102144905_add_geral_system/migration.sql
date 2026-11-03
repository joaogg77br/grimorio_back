-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "campanhaId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FichaTormenta20" (
    "id" SERIAL NOT NULL,
    "nomeJogador" TEXT NOT NULL,
    "nomePersonagem" TEXT NOT NULL,
    "raca" TEXT NOT NULL,
    "classe" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "divindade" TEXT,
    "pvCurrent" INTEGER NOT NULL,
    "pmCurrent" INTEGER NOT NULL,
    "descricao" TEXT,
    "tamanho" TEXT NOT NULL DEFAULT 'Medio',
    "for" INTEGER NOT NULL,
    "int" INTEGER NOT NULL,
    "des" INTEGER NOT NULL,
    "con" INTEGER NOT NULL,
    "sab" INTEGER NOT NULL,
    "car" INTEGER NOT NULL,
    "pvMax" INTEGER NOT NULL,
    "pmMax" INTEGER NOT NULL,
    "deslocamento" INTEGER NOT NULL,
    "tibao" INTEGER NOT NULL,
    "jogadorId" INTEGER NOT NULL,
    "campanhaId" INTEGER,

    CONSTRAINT "FichaTormenta20_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Defesa" (
    "id" SERIAL NOT NULL,
    "outros" INTEGER NOT NULL DEFAULT 0,
    "atributos" TEXT NOT NULL DEFAULT 'Des',
    "fichaId" INTEGER NOT NULL,

    CONSTRAINT "Defesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pericia" (
    "id" SERIAL NOT NULL,
    "atributo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "metadeDoNivel" INTEGER NOT NULL,
    "treino" INTEGER NOT NULL,
    "outros" INTEGER NOT NULL,
    "fichaId" INTEGER NOT NULL,

    CONSTRAINT "Pericia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arma" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" INTEGER NOT NULL,
    "dadoDeDano" TEXT NOT NULL,
    "alcance" TEXT NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "tipoDano" TEXT NOT NULL,
    "tipoArma" TEXT NOT NULL,
    "critico" INTEGER NOT NULL,
    "multiplicador" INTEGER NOT NULL,
    "atributo" TEXT NOT NULL,
    "descricao" TEXT,
    "pericia" TEXT NOT NULL,
    "equiped" BOOLEAN NOT NULL DEFAULT false,
    "fichaId" INTEGER NOT NULL,

    CONSTRAINT "Arma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modificacao" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "armaId" INTEGER,

    CONSTRAINT "modificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Historico" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "fichaId" INTEGER,

    CONSTRAINT "Historico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Protecao" (
    "id" SERIAL NOT NULL,
    "nomeProtecao" TEXT NOT NULL,
    "preco" INTEGER NOT NULL,
    "bonus" INTEGER NOT NULL,
    "penalidade" INTEGER NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "tipoProtecao" TEXT NOT NULL,
    "equipada" BOOLEAN NOT NULL DEFAULT false,
    "descricao" TEXT,
    "fichaId" INTEGER NOT NULL,

    CONSTRAINT "Protecao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Geral" (
    "id" SERIAL NOT NULL,
    "tipoItemGeral" TEXT NOT NULL,
    "preco" INTEGER NOT NULL,
    "fichaId" INTEGER NOT NULL,

    CONSTRAINT "Geral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habilidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "gastoPe" INTEGER,
    "classe" TEXT NOT NULL,
    "fichaId" INTEGER NOT NULL,

    CONSTRAINT "Habilidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Magia" (
    "id" SERIAL NOT NULL,
    "execucao" TEXT NOT NULL,
    "alcance" TEXT NOT NULL,
    "alvo" TEXT NOT NULL,
    "duracao" TEXT NOT NULL,
    "truque" TEXT,
    "gastoPe" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoMagia" TEXT NOT NULL,
    "Circulo" TEXT NOT NULL,
    "fichaId" INTEGER NOT NULL,

    CONSTRAINT "Magia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT NOT NULL,
    "fichaId" INTEGER,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campanha" (
    "id" SERIAL NOT NULL,
    "playerMestreId" INTEGER NOT NULL,
    "nomeCampanha" TEXT NOT NULL,
    "chaveLink" TEXT NOT NULL,
    "historicoRolagem" TEXT[],

    CONSTRAINT "Campanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atributo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "atributoValue" INTEGER NOT NULL DEFAULT 10,
    "modificador" INTEGER NOT NULL DEFAULT 0,
    "fichaId" INTEGER,

    CONSTRAINT "Atributo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CampanhaToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CampanhaToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CampanhaToFichaTormenta20" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CampanhaToFichaTormenta20_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Defesa_fichaId_key" ON "Defesa"("fichaId");

-- CreateIndex
CREATE INDEX "_CampanhaToUser_B_index" ON "_CampanhaToUser"("B");

-- CreateIndex
CREATE INDEX "_CampanhaToFichaTormenta20_B_index" ON "_CampanhaToFichaTormenta20"("B");

-- AddForeignKey
ALTER TABLE "FichaTormenta20" ADD CONSTRAINT "FichaTormenta20_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Defesa" ADD CONSTRAINT "Defesa_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "FichaTormenta20"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pericia" ADD CONSTRAINT "Pericia_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "FichaTormenta20"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arma" ADD CONSTRAINT "Arma_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "FichaTormenta20"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modificacao" ADD CONSTRAINT "modificacao_armaId_fkey" FOREIGN KEY ("armaId") REFERENCES "Arma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historico" ADD CONSTRAINT "Historico_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "FichaTormenta20"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protecao" ADD CONSTRAINT "Protecao_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "FichaTormenta20"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Geral" ADD CONSTRAINT "Geral_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "FichaTormenta20"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habilidade" ADD CONSTRAINT "Habilidade_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "FichaTormenta20"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Magia" ADD CONSTRAINT "Magia_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "FichaTormenta20"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "FichaTormenta20"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampanhaToUser" ADD CONSTRAINT "_CampanhaToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Campanha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampanhaToUser" ADD CONSTRAINT "_CampanhaToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampanhaToFichaTormenta20" ADD CONSTRAINT "_CampanhaToFichaTormenta20_A_fkey" FOREIGN KEY ("A") REFERENCES "Campanha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampanhaToFichaTormenta20" ADD CONSTRAINT "_CampanhaToFichaTormenta20_B_fkey" FOREIGN KEY ("B") REFERENCES "FichaTormenta20"("id") ON DELETE CASCADE ON UPDATE CASCADE;
