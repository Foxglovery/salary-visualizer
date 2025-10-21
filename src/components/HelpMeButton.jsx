import { useState, useEffect } from "react";

export default function HelpMeButton() {
  const [hovered, setHovered] = useState(false);
  const [text, setText] = useState("");

  const message = "help me, im stuck";

  useEffect(() => {
    let timer;
    if (hovered) {
      setText(""); // reset
      let i = 0;
      timer = setInterval(() => {
        setText((t) => t + message[i]);
        i++;
        if (i >= message.length) clearInterval(timer);
      }, 100);
    } else {
      setText("");
    }
    return () => clearInterval(timer);
  }, [hovered]);

  return (
    <div
      style={{
        display: "inline-block",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!hovered ? (
        <button
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#6ee7b7",
            color: "#111",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Hover me
        </button>
      ) : (
        <input
          type="text"
          readOnly
          value={text}
          style={{
            width: "180px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #aaa",
            outline: "none",
            fontFamily: "monospace",
            background: "#fff",
          }}
        />
      )}
    </div>
  );
}
