import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/userContext";
import { Toaster } from "@/components/ui/toaster";
import { MaterialLayoutProvider } from "@/contexts/LayoutContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cliente Automarked",
  description: "",
  manifest: "/manifest.json",
  keywords: ["automarked", "venda automóveis"],
  viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=yes, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased p-0 mx-auto`}
      >
        <MaterialLayoutProvider>
          <AuthProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </AuthProvider>
        </MaterialLayoutProvider>
        <Toaster />
      </body>
    </html>
  );
}
