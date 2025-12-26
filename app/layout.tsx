import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design System Autopilot",
  description: "AI-powered Figma to React code generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
