-- CreateTable
CREATE TABLE "Superhero" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "real_name" TEXT NOT NULL,
    "origin_description" TEXT NOT NULL,
    "superpowers" TEXT[],
    "catch_phrase" TEXT NOT NULL,
    "mainImageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Superhero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "superheroId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Superhero_mainImageId_key" ON "Superhero"("mainImageId");

-- AddForeignKey
ALTER TABLE "Superhero" ADD CONSTRAINT "Superhero_mainImageId_fkey" FOREIGN KEY ("mainImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_superheroId_fkey" FOREIGN KEY ("superheroId") REFERENCES "Superhero"("id") ON DELETE CASCADE ON UPDATE CASCADE;
