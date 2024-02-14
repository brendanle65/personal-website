"use client";

import React, { useContext, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { CursorState, cursorStateContext } from "@/contexts/CursorContext";

/**
 * The Cursor component is a custom element that follows the mouse.
 * (it's a supplement, not a replacement to the browser's default cursor).
 */
export default function Cursor() {
  const [cursorStyle, setCursorStyle] = useState({});
  const { cursorState: state } = useContext(cursorStateContext);
  const cursorX = useMotionValue(-100); // starts off-screen
  const cursorY = useMotionValue(-100); // starts off-screen

  const springConfig = { damping: 100, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  });

  useEffect(() => {
    if (state === CursorState.IDLE) {
      setCursorStyle({ width: 30, height: 30, opacity: 0.2 });
    } else if (state === CursorState.HOVER) {
      setCursorStyle({ width: 9, height: 9, opacity: 1 });
    } else if (state === CursorState.HIDDEN) {
      setCursorStyle({ width: 0, height: 0, opacity: 0 });
    }
  }, [state]);

  return (
    <motion.div
      style={{ translateX: cursorXSpring, translateY: cursorYSpring }}
      className="fixed left-0 top-0 pointer-events-none z-[9999]"
    >
      <motion.div
        initial={cursorStyle}
        animate={cursorStyle}
        className="bg-yellow rounded-full -translate-x-1/2 -translate-y-1/2"
      />
    </motion.div>
  );
}
