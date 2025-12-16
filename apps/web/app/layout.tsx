// apps/web/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout";
import { AuthProvider } from "@/contexts";

export const metadata: Metadata = {
  title: "Gallery - Discover & Share Beautiful Images",
  description: "A Pinterest-like gallery to discover and share stunning photography",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}