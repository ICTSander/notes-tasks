import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notes → Tasks",
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
  themeColor: "#3b82f6",
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
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          {isAuthenticated && <Nav />}
          <main className={`flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 ${isAuthenticated ? "pb-24 sm:pb-6" : ""}`}>
            {children}
          </main>
        </div>
        {isAuthenticated && <ServiceWorkerRegister />}
      </body>
    </html>
  );
}
