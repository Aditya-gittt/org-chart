-- CreateTable
CREATE TABLE "VerifiedUser" (
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "VerifiedUser_pkey" PRIMARY KEY ("email")
);
