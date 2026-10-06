import type { Metadata } from "next";
import "./globals.css";
import "./mountain-theme.css";

export const metadata: Metadata = {
  title: "Project Desk",
  description: "Business analyst projects, requirements, decisions and proposals.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
