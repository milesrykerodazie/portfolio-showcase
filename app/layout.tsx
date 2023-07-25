import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import Login from "@/components/modals/Login";
import Register from "@/components/modals/Register";
import ToastProvider from "@/providers/ToastProvider";
import { projectsCount } from "@/lib/actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio-Showcase",
  description: "Showcase your portfolio...",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //get all projects
  const projects = (await projectsCount()) as number;
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider />
        <Login />
        <Register />
        <Navbar />
        <main>{children}</main>
        <Footer count={projects} />
      </body>
    </html>
  );
}
