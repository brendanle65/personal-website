import type { ReactNode } from "react";
import type { Metadata } from "next";

import CursorStateProvider from "@/contexts/CursorContext";
import Header from "@/components/nav/Header";
import Footer from "@/components/nav/Footer";
import Cursor from "@/components/nav/Cursor";

// These styles apply to every route in the application
import "./globals.css";

export const metadata: Metadata = {
  title: "Brendan Le | Web Developer",
  description: `Welcome to the digital playground of Brendan Le, where art and technology meet.
                As a passionate web developer, I blend creativity with technical expertise to craft 
                products that inspire and resonate with users. My focus goes beyond surface-level 
                aesthetics and trendy features; it's about understanding the user's needs and designing with intention to make a meaningful impact on their lives.`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <CursorStateProvider>
          <Cursor />
          {/* <SplashScreen></SplashScreen> if or else statement to help with rendering */}
          <Header />
          {children}
          <Footer />
          {/* <Curtain /> */}
        </CursorStateProvider>
      </body>
    </html>
  );
}
