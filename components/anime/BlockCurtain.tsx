import { useState, useEffect } from "react";
import { animate } from "framer-motion";
import { shuffle } from "@/utils/shuffle";

interface ICurtainProps {
  onLoad: () => void;
  onComplete: () => void;
}

const COLS = 40; // number of columns
const ROWS = 24; // number of rows
const NUMBER_OF_CELLS = COLS * ROWS; // number of cells
const RANDOM_SEQUENCE = shuffle(Array.from({ length: NUMBER_OF_CELLS }, (_, i) => i));

const DELAY = 0.25; // how many seconds waiting before animating
const DURATION = 1; // how many seconds animation should go from full to empty
const TICKS = 30; // how many animation ticks
const CELLS_EACH_TICK = Math.ceil(NUMBER_OF_CELLS / TICKS); // how many cells to transition & animate at each tick
const TRANSITION_TICK_AMOUNT = 2; // how many ticks to leave cells in transition state before animating out
enum CELL_STATE {
  VISIBLE, // blue
  TRANSITION, // yellow
  HIDDEN, // invisible
}

/**
 * The BlockCurtain component is an overlay that transitions out from the splash screen to the main content.
 */
export default function BlockCurtain({ onLoad, onComplete }: ICurtainProps) {
  const [tick, setTick] = useState(0);
  const [grid, setGrid] = useState(Array(NUMBER_OF_CELLS).fill(CELL_STATE.VISIBLE));

  // handles onLoad event
  useEffect(onLoad, []);

  // handles ticking animation
  useEffect(() => {
    setTimeout(() => {
      const controls = animate(0, TICKS, {
        duration: DURATION,
        onUpdate(value) {
          setTick(Number(value.toFixed(0)));
        },
        onComplete() {
          onComplete();
        },
      });
      return () => controls.stop();
    }, DELAY * 100);
  }, []);

  // handles updating grid opacity on each tick
  useEffect(() => {
    // update hiding elements
    const startHidden = (tick === 0 ? tick : tick - 1) * CELLS_EACH_TICK;
    const endHidden = tick * CELLS_EACH_TICK;
    for (let i = startHidden; i < endHidden; i++) {
      const pos = RANDOM_SEQUENCE[i];
      grid[pos] = CELL_STATE.HIDDEN;
    }

    // update what elements to turn to transition state (yellow)
    const startTrans = startHidden + CELLS_EACH_TICK;
    const windowEnd = endHidden + CELLS_EACH_TICK * TRANSITION_TICK_AMOUNT;
    const beforeGridEnd = NUMBER_OF_CELLS - CELLS_EACH_TICK * TRANSITION_TICK_AMOUNT; // animation looks better when stop transitioning towards end
    for (let i = startTrans; i < windowEnd && i < beforeGridEnd; i++) {
      const pos = RANDOM_SEQUENCE[i];
      grid[pos] = CELL_STATE.TRANSITION;
    }

    setGrid([...grid]);
  }, [tick]);

  return (
    <div
      style={{
        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
      }}
      className="w-screen h-screen absolute left-0 top-0 grid"
    >
      {grid.map((state, idx) => (
        <div
          key={idx}
          className={`text-white 
          ${state === CELL_STATE.HIDDEN ? "opacity-0" : "opacity-100"} 
          ${state === CELL_STATE.TRANSITION ? "bg-yellow" : "bg-blue"}`}
        ></div>
      ))}
    </div>
  );
}
