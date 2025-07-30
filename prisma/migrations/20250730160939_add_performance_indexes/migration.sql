/*
  Warnings:

  - You are about to drop the `BookingEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InquiryEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PropertyViewEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookingEvent" DROP CONSTRAINT "BookingEvent_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "BookingEvent" DROP CONSTRAINT "BookingEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryEvent" DROP CONSTRAINT "InquiryEvent_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryEvent" DROP CONSTRAINT "InquiryEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyViewEvent" DROP CONSTRAINT "PropertyViewEvent_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyViewEvent" DROP CONSTRAINT "PropertyViewEvent_userId_fkey";

-- DropTable
DROP TABLE "BookingEvent";

-- DropTable
DROP TABLE "InquiryEvent";

-- DropTable
DROP TABLE "PropertyViewEvent";

-- CreateTable
CREATE TABLE "property_view_events" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "property_view_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_events" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT,
    "bookingId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "booking_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiry_events" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT,
    "inquiryId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "inquiry_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "property_view_events_propertyId_idx" ON "property_view_events"("propertyId");

-- CreateIndex
CREATE INDEX "property_view_events_timestamp_idx" ON "property_view_events"("timestamp");

-- CreateIndex
CREATE INDEX "booking_events_propertyId_idx" ON "booking_events"("propertyId");

-- CreateIndex
CREATE INDEX "booking_events_timestamp_idx" ON "booking_events"("timestamp");

-- CreateIndex
CREATE INDEX "inquiry_events_propertyId_idx" ON "inquiry_events"("propertyId");

-- CreateIndex
CREATE INDEX "inquiry_events_timestamp_idx" ON "inquiry_events"("timestamp");

-- CreateIndex
CREATE INDEX "bookings_userId_idx" ON "bookings"("userId");

-- CreateIndex
CREATE INDEX "bookings_propertyId_idx" ON "bookings"("propertyId");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "favorites_userId_idx" ON "favorites"("userId");

-- CreateIndex
CREATE INDEX "favorites_propertyId_idx" ON "favorites"("propertyId");

-- CreateIndex
CREATE INDEX "inquiries_userId_idx" ON "inquiries"("userId");

-- CreateIndex
CREATE INDEX "inquiries_propertyId_idx" ON "inquiries"("propertyId");

-- CreateIndex
CREATE INDEX "inquiries_status_idx" ON "inquiries"("status");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_read_idx" ON "notifications"("read");

-- CreateIndex
CREATE INDEX "properties_status_idx" ON "properties"("status");

-- CreateIndex
CREATE INDEX "properties_type_idx" ON "properties"("type");

-- CreateIndex
CREATE INDEX "properties_price_idx" ON "properties"("price");

-- CreateIndex
CREATE INDEX "properties_rating_idx" ON "properties"("rating");

-- CreateIndex
CREATE INDEX "properties_createdAt_idx" ON "properties"("createdAt");

-- CreateIndex
CREATE INDEX "properties_ownerId_idx" ON "properties"("ownerId");

-- CreateIndex
CREATE INDEX "properties_location_idx" ON "properties"("location");

-- CreateIndex
CREATE INDEX "property_amenities_propertyId_idx" ON "property_amenities"("propertyId");

-- CreateIndex
CREATE INDEX "property_amenities_amenityId_idx" ON "property_amenities"("amenityId");

-- CreateIndex
CREATE INDEX "property_images_propertyId_idx" ON "property_images"("propertyId");

-- CreateIndex
CREATE INDEX "property_images_order_idx" ON "property_images"("order");

-- CreateIndex
CREATE INDEX "reviews_propertyId_idx" ON "reviews"("propertyId");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- AddForeignKey
ALTER TABLE "property_view_events" ADD CONSTRAINT "property_view_events_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_view_events" ADD CONSTRAINT "property_view_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_events" ADD CONSTRAINT "booking_events_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_events" ADD CONSTRAINT "booking_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_events" ADD CONSTRAINT "inquiry_events_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_events" ADD CONSTRAINT "inquiry_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
