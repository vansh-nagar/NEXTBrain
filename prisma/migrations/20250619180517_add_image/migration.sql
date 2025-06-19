/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `Content` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Content` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "link" SET DEFAULT 'http://localhost:3000/db/getOtherUserData/';

-- CreateIndex
CREATE UNIQUE INDEX "Content_link_key" ON "Content"("link");

-- CreateIndex
CREATE UNIQUE INDEX "Content_title_key" ON "Content"("title");
