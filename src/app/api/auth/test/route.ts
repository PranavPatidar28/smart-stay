import { NextResponse } from "next/server";

export async function GET() {
  const hasGoogleClientId = !!process.env.GOOGLE_CLIENT_ID;
  const hasGoogleClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
  const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;
  const hasNextAuthUrl = !!process.env.NEXTAUTH_URL;
  const hasDatabaseUrl = !!process.env.DATABASE_URL;

  return NextResponse.json({
    googleClientId: hasGoogleClientId ? "Set" : "Missing",
    googleClientSecret: hasGoogleClientSecret ? "Set" : "Missing",
    nextAuthSecret: hasNextAuthSecret ? "Set" : "Missing",
    nextAuthUrl: hasNextAuthUrl ? process.env.NEXTAUTH_URL : "Missing",
    databaseUrl: hasDatabaseUrl ? "Set" : "Missing",
    nodeEnv: process.env.NODE_ENV,
  });
} 