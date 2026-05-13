import { Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata = {
  title: "Social Media Agent - Get 30 Posts in 2 Minutes",
  description: "Stop wasting hours on content creation. Our AI agent generates a complete month of professional, on-brand social media posts instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={syne.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
