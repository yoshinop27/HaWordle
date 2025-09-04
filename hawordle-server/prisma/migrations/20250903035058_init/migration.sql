-- CreateTable
CREATE TABLE "public"."Word" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "length" INTEGER NOT NULL DEFAULT 5,
    "isAnswer" BOOLEAN NOT NULL DEFAULT false,
    "gloss" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Word_word_key" ON "public"."Word"("word");
