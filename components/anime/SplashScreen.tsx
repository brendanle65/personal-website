"use client";

import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";

const LOADING_BAR_DURATION = 3.5; // how many seconds it takes to go from 0% to 100%
const BIO = "Hello, I'm Brendan Le. <br/> I design and develop websites <br/> and  apps that use artificial intelligence."; // prettier-ignore
const SCRAMBLE_WINDOW = 20; // length of subtext to keep scrambled at any time
const SCRAMBLE_CHARACTERS = "abcdefghijklmnopqrstuvwxyz!@#$%^&*{}[]";
const SCRAMBLE_EVERY_NTH_PROGRESS = 3; // only unscramble & reveal text every nth percent
// prettier-ignore
const KEEP_UNSCRAMBLED = (() => { // list of indices to keep unscrambled to reduce total visual randomness 
  const GAP = 3; // gap size to randomly generate indices
  const indices = [Math.floor(Math.random() * (GAP + 1))]; // random index between 0 and GAP
  let lastValue = indices[0];
  while (lastValue < BIO.length - GAP) {
    lastValue = indices[indices.length - 1];
    const increment = Math.floor(Math.random() * (GAP + 2)) + 1; // random increment between 1 and GAP + 1
    indices.push(lastValue + increment);
  }
  return indices;
})();

interface ISplashScreenProps {
  onComplete: () => void;
}

const transition = {
  duration: 0.75,
  delay: 0.5,
  ease: [0.22, 1.22, 0.95, 0.92],
};

/**
 * The SplashScreen component is the launching screen that the user sees when the page is first loaded.
 */
export default function SplashScreen({ onComplete }: ISplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [bio, setBio] = useState({
    unscrambled: "",
    scrambled: "",
  });

  // handles updating progress from 0% to 100%
  useEffect(() => {
    const controls = animate(0, 100, {
      duration: LOADING_BAR_DURATION,
      onUpdate(value) {
        setProgress(Number(value.toFixed(0)));
      },
      onComplete() {
        onComplete();
      },
    });
    return () => controls.stop();
  }, []);

  // handles unscrambling & revealing bio as progress updates
  useEffect(() => {
    const upto = Math.floor(BIO.length * progress * 0.01) + SCRAMBLE_WINDOW;

    // only update every nth percent to reduce animation velocity
    if (upto % SCRAMBLE_EVERY_NTH_PROGRESS === 0) {
      const divider = upto - SCRAMBLE_WINDOW;
      const unscrambled = BIO.substring(0, divider);
      const toScramble = BIO.substring(divider, upto);
      const scrambled = (() => {
        let result = "";
        // keep indicated letters unscrambled to reduce visual randomness
        for (let i = 0; i < toScramble.length; i++) {
          if (KEEP_UNSCRAMBLED.includes(unscrambled.length + i)) {
            result += BIO.charAt(unscrambled.length + i);
          } else {
            const random = Math.floor(Math.random() * SCRAMBLE_CHARACTERS.length);
            result += SCRAMBLE_CHARACTERS[random];
          }
        }
        return result;
      })();

      setBio({ unscrambled, scrambled });
    } else if (progress === 100) {
      // handle gap between SCRAMBLE_EVERY_NTH_PROGRESS frame and ending
      setBio({ unscrambled: BIO, scrambled: "" });
    }
  }, [progress]);

  return (
    <div className="w-screen h-screen bg-blue flex flex-col px-16 overflow-hidden">
      <div className="text-white absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-80 h-24 ml-4 overflow-hidden">
        <motion.p exit={{ y: "-100%" }} transition={transition}>
          <span dangerouslySetInnerHTML={{ __html: bio.unscrambled }} />
          <span className="text-yellow">{bio.scrambled}</span>
        </motion.p>
      </div>
      <div className="mt-auto mb-4 overflow-hidden">
        <motion.div
          style={{ x: progress + "%" }}
          exit={{ y: "-100%" }}
          transition={transition}
          className="text-6xl ml-24"
        >
          <div className="inline-block -translate-x-full">
            <span className="text-white">{progress}</span>
            <span className="text-yellow">%</span>
          </div>
        </motion.div>
      </div>
      <motion.hr
        exit={{ width: 0 }}
        transition={transition}
        className="w-full border border-dashed border-yellow mb-16"
      />
    </div>
  );
}
