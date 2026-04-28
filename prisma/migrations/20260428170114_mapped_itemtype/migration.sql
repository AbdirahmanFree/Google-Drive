/*
  Warnings:

  - Changed the type of `type` on the `item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "itemType" AS ENUM ('file', 'folder');

-- AlterTable
ALTER TABLE "item" DROP COLUMN "type",
ADD COLUMN     "type" "itemType" NOT NULL;

-- DropEnum
DROP TYPE "ItemType";
