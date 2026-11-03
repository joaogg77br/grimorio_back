-- CreateTable
CREATE TABLE "CamposSimples" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "fichaGeralId" INTEGER,

    CONSTRAINT "CamposSimples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accountants" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "accontantType" TEXT NOT NULL DEFAULT 'bar',
    "fichaGeralId" INTEGER,

    CONSTRAINT "Accountants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CamposSimples" ADD CONSTRAINT "CamposSimples_fichaGeralId_fkey" FOREIGN KEY ("fichaGeralId") REFERENCES "fichaGeral"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accountants" ADD CONSTRAINT "Accountants_fichaGeralId_fkey" FOREIGN KEY ("fichaGeralId") REFERENCES "fichaGeral"("id") ON DELETE SET NULL ON UPDATE CASCADE;
