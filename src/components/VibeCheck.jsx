import { useState } from "react";

const vibes = [
  { text: "Everything is fine.", color: "#a7c7e7" },
  { text: "Something is slightly cursed.", color: "#d8bfd8" },
  { text: "You should drink water.", color: "#b5ead7" },
  { text: "Chaos but make it cozy.", color: "#ffdac1" },
  { text: "This button knows too much.", color: "#cdb4db" },
  { text: "Mildly haunted, carry on.", color: "#e2f0cb" },
  { text: "You are doing great, actually.", color: "#ffd6e0" }
];

export default function RandomVibe() {
  const [vibe, setVibe] = useState(vibes[0]);

  function rollVibe() {
    const randomIndex = Math.floor(Math.random() * vibes.length);
    setVibe(vibes[randomIndex]);
  }

  return (
    <div
      style={{
        backgroundColor: vibe.color,
        padding: "2rem",
        borderRadius: "12px",
        textAlign: "center",
        transition: "background-color 0.3s ease"
      }}
    >
      <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
        {vibe.text}
      </p>

      <button onClick={rollVibe}>
        Roll the vibe 🎲
      </button>
    </div>
  );
}
