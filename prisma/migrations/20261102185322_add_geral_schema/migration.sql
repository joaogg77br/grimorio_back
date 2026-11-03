-- CreateTable
CREATE TABLE "fichaGeral" (
    "id" SERIAL NOT NULL,
    "nomePersonagem" TEXT NOT NULL,
    "nomeJogador" TEXT NOT NULL,
    "jogadorId" INTEGER NOT NULL,

    CONSTRAINT "fichaGeral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoFichaGeral" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "fichaGeralId" INTEGER,

    CONSTRAINT "HistoricoFichaGeral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArmaFichaGeral" (
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
    "fichaGeralId" INTEGER,

    CONSTRAINT "ArmaFichaGeral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabilidadeFichaGeral" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "custo" INTEGER,
    "fichaGeralId" INTEGER,

    CONSTRAINT "HabilidadeFichaGeral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefesaFichaGeral" (
    "id" SERIAL NOT NULL,
    "outros" INTEGER NOT NULL DEFAULT 0,
    "atributos" TEXT NOT NULL DEFAULT 'Des',
    "fichaId" INTEGER NOT NULL,
    "fichaGeralId" INTEGER,

    CONSTRAINT "DefesaFichaGeral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PericiasFichaGeral" (
    "id" SERIAL NOT NULL,
    "atributo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "treino" INTEGER NOT NULL,
    "outros" INTEGER NOT NULL,
    "fichaGeralId" INTEGER,

    CONSTRAINT "PericiasFichaGeral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DefesaFichaGeral_fichaId_key" ON "DefesaFichaGeral"("fichaId");

-- AddForeignKey
ALTER TABLE "fichaGeral" ADD CONSTRAINT "fichaGeral_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoFichaGeral" ADD CONSTRAINT "HistoricoFichaGeral_fichaGeralId_fkey" FOREIGN KEY ("fichaGeralId") REFERENCES "fichaGeral"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArmaFichaGeral" ADD CONSTRAINT "ArmaFichaGeral_fichaGeralId_fkey" FOREIGN KEY ("fichaGeralId") REFERENCES "fichaGeral"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabilidadeFichaGeral" ADD CONSTRAINT "HabilidadeFichaGeral_fichaGeralId_fkey" FOREIGN KEY ("fichaGeralId") REFERENCES "fichaGeral"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefesaFichaGeral" ADD CONSTRAINT "DefesaFichaGeral_fichaGeralId_fkey" FOREIGN KEY ("fichaGeralId") REFERENCES "fichaGeral"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PericiasFichaGeral" ADD CONSTRAINT "PericiasFichaGeral_fichaGeralId_fkey" FOREIGN KEY ("fichaGeralId") REFERENCES "fichaGeral"("id") ON DELETE SET NULL ON UPDATE CASCADE;
