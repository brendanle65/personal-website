import { useState, useEffect } from "react";
import { animate } from "framer-motion";
import { shuffle } from "@/utils/shuffle";

interface IBlockCurtainProps {
  onLoad: () => void;
  onComplete: () => void;
}

const CELL_SIZE = 4; // how many viewport widths long and high each cell should be
const DELAY = 0.25; // how many seconds waiting before animating
const DURATION = 2; // how many seconds animation should go from full to empty
const TICKS = 45; // how many animation ticks
const TRANSITION_TICK_AMOUNT = 4; // how many ticks to leave cells in transition state before animating out

enum CELL_STATE {
  VISIBLE, // blue
  TRANSITION, // yellow
  HIDDEN, // invisible
}

/**
 * The BlockCurtain component is an overlay that transitions out from the splash screen to the main content.
 */
export default function BlockCurtain({ onLoad, onComplete }: IBlockCurtainProps) {
  const [grid, setGrid] = useState([CELL_STATE.VISIBLE]);
  const [config, setConfig] = useState<{ rowCount: number; colCount: number }>();

  // run after mounting
  useEffect(() => {
    onLoad();

    // calculate grid configuration based on window size and height
    const adjust = (window.innerWidth / window.innerHeight) * 100; // adjust for when width !== height, so that each cell is still a square
    const rowCount = Math.floor(100 / CELL_SIZE); // number of rows
    const colCount = Math.floor(adjust / CELL_SIZE); // number of columns
    const cellCount = rowCount * colCount; // number of cells
    const randomSequence = shuffle(Array.from({ length: cellCount }, (_, i) => i)); // random order of which cells to animate at each tick
    const cellsEachTick = Math.ceil(cellCount / TICKS); // how many cells to transition & animate at each tick
    setGrid(Array(cellCount).fill(CELL_STATE.VISIBLE));
    setConfig({ rowCount, colCount });

    let controls;
    let tick = 0;
    const timer = setTimeout(() => {
      controls = animate(0, TICKS, {
        duration: DURATION,
        ease: "easeInOut",
        onUpdate() {
          tick++;

          // update hiding elements
          const startHidden = (tick === 0 ? tick : tick - 1) * cellsEachTick;
          const endHidden = tick * cellsEachTick;
          for (let i = startHidden; i < endHidden; i++) {
            const pos = randomSequence[i];
            grid[pos] = CELL_STATE.HIDDEN;
          }

          // update what elements to turn to transition state (yellow)
          const startTrans = startHidden + cellsEachTick;
          const windowEnd = endHidden + cellsEachTick * TRANSITION_TICK_AMOUNT;
          const beforeGridEnd = cellCount - cellsEachTick * TRANSITION_TICK_AMOUNT; // animation looks better when stop transitioning towards end
          for (let i = startTrans; i < windowEnd && i < beforeGridEnd; i++) {
            const pos = randomSequence[i];
            grid[pos] = CELL_STATE.TRANSITION;
          }

          setGrid([...grid]);
        },
        onComplete() {
          onComplete();
          /**
           * temporary workaround:
           * In some cases, the onUpdate() function may not run frequently enough, resulting in
           * some squares being left unanimated by the end. Therefore, set all squares
           * to hidden by the end of the animation.
           */
          setGrid(Array(cellCount).fill(CELL_STATE.HIDDEN));
        },
      });
    }, DELAY * 1000);

    // cleanup
    return () => {
      clearTimeout(timer);
      if (controls) {
        controls.stop();
      }
    };
  }, []);

  return (
    <div
      style={
        config && {
          gridTemplateColumns: `repeat(${config.colCount}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${config.rowCount}, minmax(0, 1fr))`,
        }
      }
      className="w-screen h-screen absolute left-0 top-0 grid pointer-events-none"
    >
      {grid.map((state, idx) => (
        <div
          key={idx}
          className={`
          ${state === CELL_STATE.HIDDEN ? "opacity-0" : "opacity-100"} 
          ${state === CELL_STATE.TRANSITION ? "bg-yellow" : "bg-blue"}`}
        ></div>
      ))}
    </div>
  );
}
