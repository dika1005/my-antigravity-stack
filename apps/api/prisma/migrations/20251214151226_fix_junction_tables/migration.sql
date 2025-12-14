/*
  Warnings:

  - The primary key for the `tags_on_galleries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tags_on_images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[galleryId,tagId]` on the table `tags_on_galleries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageId,tagId]` on the table `tags_on_images` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `tags_on_galleries` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `tags_on_images` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `tags_on_galleries` DROP PRIMARY KEY,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `tags_on_images` DROP PRIMARY KEY,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `tags_on_galleries_galleryId_tagId_key` ON `tags_on_galleries`(`galleryId`, `tagId`);

-- CreateIndex
CREATE UNIQUE INDEX `tags_on_images_imageId_tagId_key` ON `tags_on_images`(`imageId`, `tagId`);
