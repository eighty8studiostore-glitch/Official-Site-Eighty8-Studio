import "./globals.css";
import { Inter } from "next/font/google";
// Import from YOUR new component, not the library
import { ThemeProvider } from "@/components/ThemeProvider"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Eighty8 Studio | High-Performance Software",
  description: "Elite software development agency.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          {children}
      </body>
    </html>
  );
}