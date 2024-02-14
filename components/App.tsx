"use client";

import { ReactNode, useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { splashStateContext, SplashState } from "@/contexts/SplashContext";

import Cursor from "./nav/Cursor";
import Header from "./nav/Header";
import Footer from "./nav/Footer";
import Curtain from "./anime/Curtain";
import SplashScreen from "./anime/SplashScreen";

interface IAppProps {
  children: ReactNode;
}

/**
 * The App component is the root component that contains the heirarchy of all display components.
 */
export default function App({ children }: IAppProps) {
  const { splashState, setSplashState } = useContext(splashStateContext);

  return (
    <>
      <Cursor />
      <AnimatePresence mode="wait">
        {splashState === SplashState.SPLASH_IN_PROGRESS ? (
          <SplashScreen onComplete={() => setSplashState(SplashState.SPLASH_COMPLETED)} />
        ) : (
          <>
            <>
              <Header />
              {children}
              <Footer />
            </>
            <Curtain
              onLoad={() => setSplashState(SplashState.CURTAIN_IN_PROGRESS)}
              onComplete={() => setSplashState(SplashState.CURTAIN_COMPLETED)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
