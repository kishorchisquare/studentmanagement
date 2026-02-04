import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  title: "Student Management",
  description: "JWT-secured student management UI"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plex.className} ${mono.className}`} data-fonts="ready">
        {children}
      </body>
    </html>
  );
}
