-- CreateTable
CREATE TABLE "modificacao" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "armaId" INTEGER,

    CONSTRAINT "modificacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "modificacao" ADD CONSTRAINT "modificacao_armaId_fkey" FOREIGN KEY ("armaId") REFERENCES "Arma"("id") ON DELETE SET NULL ON UPDATE CASCADE;
