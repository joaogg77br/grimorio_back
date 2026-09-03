-- DropForeignKey
ALTER TABLE "Defesa" DROP CONSTRAINT "Defesa_fichaId_fkey";

-- AddForeignKey
ALTER TABLE "Defesa" ADD CONSTRAINT "Defesa_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "Ficha"("id") ON DELETE CASCADE ON UPDATE CASCADE;
