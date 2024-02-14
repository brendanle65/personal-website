import { ReactNode } from "react";
import { Metadata } from "next";

import SplashStateProvider from "@/contexts/SplashContext";
import CursorStateProvider from "@/contexts/CursorContext";
import App from "@/components/App";

// These styles apply to every route in the application
import "./globals.css";

export const metadata: Metadata = {
  title: "Brendan Le | Web Developer",
  description: `Welcome to the digital playground of Brendan Le, where art and technology meet.
                As a passionate web developer, I blend creativity with technical expertise to craft 
                products that inspire and resonate with users. My focus goes beyond surface-level 
                aesthetics and trendy features; it's about understanding the user's needs and designing with intention to make a meaningful impact on their lives.`,
};

interface IRootLayoutProps {
  children: ReactNode;
}

/**
 * The RootLayout component is the root component that contains the heirarchy of all utility and metadata components.
 */
export default function RootLayout({ children }: IRootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <SplashStateProvider>
          <CursorStateProvider>
            <App>{children}</App>
          </CursorStateProvider>
        </SplashStateProvider>
      </body>
    </html>
  );
}
