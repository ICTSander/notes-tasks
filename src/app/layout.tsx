import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notes \u2192 Tasks",
  description: "Convert messy notes into clear, actionable tasks",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tasks",
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/apple-touch-icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#070A16",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  const isAuthenticated = session?.value?.startsWith("authenticated.");

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-bg-0`}>
        {isAuthenticated ? (
          <AppShell>{children}</AppShell>
        ) : (
          <main className="flex-1 w-full max-w-[1000px] mx-auto px-4 sm:px-8 py-6">
            {children}
          </main>
        )}
        {isAuthenticated && <ServiceWorkerRegister />}
      </body>
    </html>
  );
}
