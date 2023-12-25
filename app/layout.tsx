import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Modal from "./components/Modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo List",
  description: "Created By Neel Chotaliya [3301], [Inspired By Trello]",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f5f6f8]`}>
        <div className="flex flex-col items-center justify-center w-screen min-w-[320px] ">
          <Modal />
          {children}
        </div>
      </body>
    </html>
  );
}
