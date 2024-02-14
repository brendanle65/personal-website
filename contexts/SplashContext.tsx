"use client";

import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

/**
 * Represents the different stages of the browser's initial loading.
 * This enumeration helps coordinate which elements to load initially and transition them out from the splash screen.
 */
export enum SplashState {
  "SPLASH_IN_PROGRESS", // indicates splash animation is in progress
  "SPLASH_COMPLETED", // indicates when the splash animation is complete
  "CURTAIN_IN_PROGRESS", // indicates rising curtain animation is in progress
  "CURTAIN_COMPLETED", // indicates when the curtain animation is complete
}

// the properties and methods that will be shared with other components
interface ISplashStateContext {
  splashState: SplashState;
  setSplashState: Dispatch<SetStateAction<SplashState>>;
}

export const splashStateContext = createContext<ISplashStateContext>(null);

interface ISplashStateProviderProps {
  children: ReactNode;
}

/**
 * The SplashStateProvider component shares splash data and methods to update it via the context API.
 */
export default function SplashStateProvider({ children }: ISplashStateProviderProps) {
  const [splashState, setSplashState] = useState(SplashState.SPLASH_IN_PROGRESS);

  return (
    <splashStateContext.Provider value={{ splashState, setSplashState }}>
      {children}
    </splashStateContext.Provider>
  );
}
