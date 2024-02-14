"use client";

import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

/**
 * The current state of the browser's cursor. This is referring to the state of element
 * that will act as a supplement (not a replacement) to the browser's default mouse.
 */

export enum CursorState {
  "HIDDEN", // when the cursor needs to be completely hidden
  "IDLE", // when the cursor is not hovering over anything special - the default state
  "HOVER", // when the cursor is hovering over an interactable element
}

// the properties and methods that will be shared with other components
interface ICursorStateContext {
  cursorState: CursorState;
  setCursorState: Dispatch<SetStateAction<CursorState>>;
}

export const cursorStateContext = createContext<ICursorStateContext>(null);

interface ICursorStateProviderProps {
  children: ReactNode;
}

/**
 * The CursorStateProvider component shares cursor data and methods to update it via the context API.
 */
export default function CursorStateProvider({ children }: ICursorStateProviderProps) {
  const [cursorState, setCursorState] = useState(CursorState.IDLE);

  return (
    <cursorStateContext.Provider value={{ cursorState, setCursorState }}>
      {children}
    </cursorStateContext.Provider>
  );
}
