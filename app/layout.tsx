import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import Login from "@/components/modals/Login";
import Register from "@/components/modals/Register";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio-Showcase",
  description: "Showcase your portfolio...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Login />
        <Register />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
