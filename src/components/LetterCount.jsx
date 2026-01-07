import { useState } from "react";

export default function LetterCounter() {
  const [text, setText] = useState("");

  const letterCounts = text
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .split("")
    .reduce((acc, letter) => {
      acc[letter] = (acc[letter] || 0) + 1;
      return acc;
    }, {});

  return (
    <div style={{ maxWidth: 400 }}>
      <label>
        Enter a sentence:
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", marginTop: 8 }}
        />
      </label>

      <ul style={{ marginTop: 12 }}>
        {Object.entries(letterCounts).map(([letter, count]) => (
          <li key={letter}>
            <strong>{letter}</strong>: {count}
          </li>
        ))}
      </ul>
    </div>
  );
}
