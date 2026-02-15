import { useEffect, useState } from "react";

const PHRASES = [
  "squiggle",
  "moon-toss",
  "whisper engine",
  "static bloom",
  "mirror rain",
  "teal pulse",
  "mango drift",
  "velvet ping",
  "copper kite",
  "paper comet",
];

const COLORS = ["#2F4F4F", "#B7410E", "#5F4B8B", "#0B6E4F", "#A31621", "#2A2F4F"];

const randomFrom = (list) => list[Math.floor(Math.random() * list.length)];

const buildRandomState = () => {
  return {
    phrase: randomFrom(PHRASES),
    color: randomFrom(COLORS),
    tilt: Math.floor(Math.random() * 11) - 5,
    dots: Array.from({ length: 7 }, () => Math.floor(Math.random() * 9) + 1),
  };
};

export default function CanIs() {
  const [randomState, setRandomState] = useState(() => buildRandomState());

  useEffect(() => {
    const timer = setInterval(() => {
      setRandomState(buildRandomState());
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="can-is" style={{ borderColor: randomState.color }}>
      <header className="can-is__header" style={{ color: randomState.color }}>
        {randomState.phrase}
      </header>
      <div className="can-is__dial" style={{ transform: `rotate(${randomState.tilt}deg)` }}>
        {randomState.dots.map((dot, index) => (
          <span className="can-is__dot" key={`${dot}-${index}`}>
            {dot}
          </span>
        ))}
      </div>
      <button className="can-is__button" onClick={() => setRandomState(buildRandomState())}>
        roll again
      </button>
    </section>
  );
}
