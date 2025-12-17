import { useState } from "react";

const ZODIAC_TO_NUMBER = {
  Aries: 1,
  Taurus: 2,
  Gemini: 3,
  Cancer: 4,
  Leo: 5,
  Virgo: 6,
  Libra: 7,
  Scorpio: 8,
  Sagittarius: 9,
  Capricorn: 10,
  Aquarius: 11,
  Pisces: 12,

  // optional: chaos padding to reach 22
  Ophiuchus: 13,
};

const SIGNS = Object.keys(ZODIAC_TO_NUMBER);

export default function ZodiacNumberOracle() {
  const [sign, setSign] = useState("");
  const [number, setNumber] = useState(null);

  const handleChange = (e) => {
    const chosen = e.target.value;
    setSign(chosen);

    if (chosen) {
      // fold into 1–22 no matter what
      const base = ZODIAC_TO_NUMBER[chosen];
      const result = ((base - 1) % 22) + 1;
      setNumber(result);
    } else {
      setNumber(null);
    }
  };

  return (
    <div style={styles.card}>
      <label style={styles.label}>
        What is your astrological sign?
        <select value={sign} onChange={handleChange} style={styles.input}>
          <option value="">Select your destiny</option>
          {SIGNS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      {number !== null && (
        <div style={styles.result}>
          Your number is <strong>{number}</strong>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    maxWidth: 360,
    padding: 16,
    borderRadius: 14,
    border: "1px solid #ddd",
    display: "grid",
    gap: 12,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  label: {
    display: "grid",
    gap: 6,
    fontSize: 14,
  },
  input: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  result: {
    marginTop: 8,
    fontSize: 16,
  },
};
