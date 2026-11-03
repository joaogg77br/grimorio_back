-- CreateTable
CREATE TABLE "_CampanhaTofichaGeral" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CampanhaTofichaGeral_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CampanhaTofichaGeral_B_index" ON "_CampanhaTofichaGeral"("B");

-- AddForeignKey
ALTER TABLE "_CampanhaTofichaGeral" ADD CONSTRAINT "_CampanhaTofichaGeral_A_fkey" FOREIGN KEY ("A") REFERENCES "Campanha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampanhaTofichaGeral" ADD CONSTRAINT "_CampanhaTofichaGeral_B_fkey" FOREIGN KEY ("B") REFERENCES "fichaGeral"("id") ON DELETE CASCADE ON UPDATE CASCADE;
