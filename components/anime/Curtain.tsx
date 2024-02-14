interface ICurtainProps {
  onLoad: () => void;
  onComplete: () => void;
}

export default function Curtain({ onLoad, onComplete }: ICurtainProps) {
  return <h1>Splash Screen</h1>;
}
