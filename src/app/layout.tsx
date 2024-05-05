import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css'
import { WalletConnectProvider } from "./services/providers/WalletConnectProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet Getter",
  description: "Generated wallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <WalletConnectProvider>
           {children}
           </WalletConnectProvider>
       </body>
    </html>
  );
}
