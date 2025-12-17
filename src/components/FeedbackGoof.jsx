import { useEffect, useRef, useState } from "react";

const LOVE_MESSAGES = [
  "I LOVE this app. It's so easy to use I could do it with oven mitts on.",
  "Everything is intuitive, beautiful, and fast. My soul feels organized now.",
  "This UI is a gentle breeze through my cluttered brain. Five stars forever.",
  "I clicked once and achieved enlightenment. The app did the rest. Effortless.",
];

function pickMessage() {
  return LOVE_MESSAGES[Math.floor(Math.random() * LOVE_MESSAGES.length)];
}

// eslint-disable-next-line react/prop-types
export default function ParodyGuiltAssuager({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  // typewriter internals
  const targetRef = useRef(pickMessage());
  const idxRef = useRef(0);
  const rafRef = useRef(null);

  const nudge = () => {
    // any interaction = HIGH RATING + restart typewriter praise
    setRating(5);
    startTypewriter(pickMessage());
  };

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const startTypewriter = (nextTarget) => {
    stop();
    targetRef.current = nextTarget;
    idxRef.current = 0;
    setText("");

    const tick = () => {
      const t = targetRef.current;
      const i = idxRef.current;

      // reveal 1 char per frame (~60 chars/sec)
      if (i <= t.length) {
        setText(t.slice(0, i));
        idxRef.current = i + 1;
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    // start typing immediately
    startTypewriter(targetRef.current);
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      rating: 5,
      experience: targetRef.current,
      submittedAt: new Date().toISOString(),
      parody: true,
    };
    onSubmit?.(payload);
    alert("Thank you (for your totally authentic feedback).");
    nudge(); // restart the praise loop after submit
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={styles.card}
      onMouseDown={nudge}
      onPointerDown={nudge}
      onKeyDown={nudge}
      onFocusCapture={nudge}
      aria-label="Parody feedback form"
    >
      <div style={styles.header}>
        <h3 style={styles.h3}>Totally Real Feedback Form™</h3>
        <span style={styles.badge} title="This is a joke.">
          PARODY
        </span>
      </div>

      {/* 1) Rating */}
      <label style={styles.label}>
        Rating
        <select
          value={rating}
          onChange={() => nudge()}
          style={styles.input}
          aria-label="Rating (parody)"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>

      {/* 2) Describe your experience */}
      <label style={styles.label}>
        Describe your experience
        <textarea
          value={text}
          onChange={() => nudge()}
          placeholder="Type anything. The app knows the truth."
          rows={5}
          style={{ ...styles.input, ...styles.textarea }}
          aria-label="Experience (parody)"
        />
      </label>

      {/* 3) Thank you button */}
      <button type="submit" style={styles.button}>
        Thank you
      </button>

      <p style={styles.finePrint}>
        (Parody) Any resemblance to real UX research is purely coincidental.
      </p>
    </form>
  );
}

const styles = {
  card: {
    maxWidth: 520,
    padding: 16,
    border: "1px solid #ddd",
    borderRadius: 14,
    display: "grid",
    gap: 12,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  h3: { margin: 0, fontSize: 18 },
  badge: {
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid #aaa",
  },
  label: { display: "grid", gap: 6, fontSize: 14 },
  input: {
    border: "1px solid #ccc",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 14,
    outline: "none",
  },
  textarea: { resize: "vertical" },
  button: {
    border: "none",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 14,
    cursor: "pointer",
  },
  finePrint: { margin: 0, fontSize: 12, opacity: 0.75 },
};
