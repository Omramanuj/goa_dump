import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata = {
  title: "Goa Squad Spots",
  description: "Private Goa trip board for logging places, ratings, and vibes."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable} bg-ink text-mist`}>
        {children}
      </body>
    </html>
  );
}
