import "./globals.css";
import Providers from "./components/Providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institute Feedback System",
  description: "Feedback management system for Symbiosis Institute of Technology, Pune",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
