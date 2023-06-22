-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "restaurant" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "food" TEXT NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);
