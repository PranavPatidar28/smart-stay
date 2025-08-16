-- AlterTable
ALTER TABLE "otp_verifications" ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "usedAt" TIMESTAMP(3);
