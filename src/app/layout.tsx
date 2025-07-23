import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import ToastProvider from "@/components/providers/ToastProvider";
import { Analytics } from "@vercel/analytics/next"



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
        <Analytics/>
      </body>
    </html>
  );
}
