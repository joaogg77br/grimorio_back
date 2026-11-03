-- Preserve the current counter value while renaming the old field.
ALTER TABLE "Accountants" RENAME COLUMN "value" TO "currentValue";

-- New fields use defaults so existing counter rows remain valid.
ALTER TABLE "Accountants"
ADD COLUMN "maximumValue" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "color" TEXT NOT NULL DEFAULT '#b4233c';

ALTER TABLE "Accountants" ALTER COLUMN "color" DROP DEFAULT;
