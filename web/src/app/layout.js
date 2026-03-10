import { Poppins } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/auth/SessionWrapper";
import ChatBot from "@/components/ChatBot";

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '900'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Smart Crop Advisory System",
  description: "AI-powered crop advisory for small and marginal farmers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased bg-background text-foreground min-h-screen`}>
        <SessionWrapper>
          {children}
          <ChatBot />
        </SessionWrapper>
      </body>
    </html>
  );
}
