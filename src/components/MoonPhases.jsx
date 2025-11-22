import  { useState, useMemo } from "react";

const MOON_PHASES = [
  {
    key: 0,
    name: "New Moon",
    vibe: "Reset, rest, intention-setting",
    chores: [
      "Do light, low-effort tidying (clear one surface, not the whole house)",
      "Clean and reset your altar or a special shelf",
      "Journal goals or to-do lists for the next two weeks",
      "Sort seed packets, plan garden beds, but don’t plant yet",
      "Declutter digital stuff: delete 10 old photos or emails"
    ]
  },
  {
    key: 1,
    name: "Waxing Crescent",
    vibe: "Plant the seeds, start small",
    chores: [
      "Start small projects: one drawer, one cabinet, one bed in the garden",
      "Start seeds indoors or plan where transplants will go",
      "Do quick 10–15 minute cleaning bursts in different rooms",
      "Wash and prep containers/pots for upcoming plantings",
      "Begin tracking a new habit (sleep, water, cleaning, etc.)"
    ]
  },
  {
    key: 2,
    name: "First Quarter",
    vibe: "Action, push through resistance",
    chores: [
      "Tackle medium-sized chores you’ve been avoiding (bathroom, fridge, car)",
      "Do structural garden work: staking, trellises, bed edging",
      "Sort and label storage bins, jars, or pantry containers",
      "Handle necessary but annoying admin: bills, calls, scheduling",
      "Deep clean the main work zone (desk, kitchen prep area, craft space)"
    ]
  },
  {
    key: 3,
    name: "Waxing Gibbous",
    vibe: "Refine, improve, prepare",
    chores: [
      "Fine-tune spaces you already cleaned (organize, pretty it up)",
      "Thin seedlings, prune lightly, or adjust plant spacing",
      "Batch prep ingredients or freezer meals for future you",
      "Label everything you’ve been saying you’ll label for weeks",
      "Do maintenance: sharpen tools, oil cutting boards, fix squeaky doors"
    ]
  },
  {
    key: 4,
    name: "Full Moon",
    vibe: "Peak energy, showcase & cleanse",
    chores: [
      "Do a big “showtime” clean of main living areas",
      "Wash bedding, blankets, and anything cozy",
      "Sweep and energetically cleanse floors/thresholds",
      "Show off your space: take photos, host a little hang, or just enjoy it",
      "Moon-gaze with tea and actually admire what you’ve done"
    ]
  },
  {
    key: 5,
    name: "Waning Gibbous",
    vibe: "Gratitude, sharing, adjusting",
    chores: [
      "Declutter gently: donate or re-home items you don’t use",
      "Harvest and share herbs/produce, or prep them for drying",
      "Clean out the pantry of stale/expired things",
      "Write labels, notes, or logs for what worked well this cycle",
      "Do laundry that’s been lurking in baskets or corners"
    ]
  },
  {
    key: 6,
    name: "Last Quarter",
    vibe: "Release, cut away, tough love",
    chores: [
      "Do a ruthless declutter of one category (mugs, t-shirts, etc.)",
      "Prune plants more firmly, remove diseased/dead growth",
      "Unsubscribe from junk emails and silence annoying notifications",
      "Take out trash and recycling from every room",
      "Deal with that one “doom pile” of papers or random stuff"
    ]
  },
  {
    key: 7,
    name: "Waning Crescent",
    vibe: "Rest, reset, compost the old",
    chores: [
      "Soft reset: gentle tidy, nothing heroic",
      "Compost kitchen scraps, dead plants, or old intentions",
      "Wash your favorite mug, blanket, and comfy clothes",
      "Prep a cozy corner for the next New Moon planning session",
      "Take notes: what do you NOT want to drag into the next cycle?"
    ]
  }
];

// Conway-style moon phase approximation: returns 0–7
function getMoonPhaseIndex(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1; // JS months 0–11 → 1–12
  const day = date.getDate();

  if (month < 3) {
    year -= 1;
    month += 12;
  }

  month += 1; // shift month for algorithm

  const c = Math.floor(365.25 * year);
  const e = Math.floor(30.6 * month);
  let jd = c + e + day - 694039.09; // days since known new moon
  jd /= 29.5305882; // length of synodic month
  const b = Math.floor(jd);
  jd -= b; // fractional part of current lunation

  let phaseIndex = Math.round(jd * 8);
  if (phaseIndex >= 8) phaseIndex = 0;

  return phaseIndex; // 0=new, 4=full, etc.
}

// Return illuminated fraction 0..1 (0=new moon, 1=full moon)
function getMoonIllumination(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate() + (date.getHours() / 24) + (date.getMinutes() / 1440) + (date.getSeconds() / 86400);

  if (month < 3) {
    year -= 1;
    month += 12;
  }

  month += 1;

  const c = Math.floor(365.25 * year);
  const e = Math.floor(30.6 * month);
  let jd = c + e + day - 694039.09; // days since known new moon
  jd /= 29.5305882; // length of synodic month
  const b = Math.floor(jd);
  const frac = jd - b; // fractional lunation 0..1

  // illumination approximated by (1 - cos(phaseAngle)) / 2
  const phaseAngle = frac * 2 * Math.PI; // 0..2π
  const illum = (1 - Math.cos(phaseAngle)) / 2;
  return illum; // 0 (new) .. 1 (full)
}

export default function MoonChorePlanner() {
  const [dateString, setDateString] = useState(() => {
    const today = new Date();
    // format yyyy-mm-dd for <input type="date">
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const { phase, chores, illumination } = useMemo(() => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const phaseIndex = getMoonPhaseIndex(date);
    const phaseInfo = MOON_PHASES.find(p => p.key === phaseIndex) ?? MOON_PHASES[0];
    // compute illumination/brightness for this date
    const illumination = getMoonIllumination(date);
    return {
      phase: phaseInfo,
      chores: phaseInfo.chores,
      illumination
    };
  }, [dateString]);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "1.5rem",
        borderRadius: "1rem",
        border: "1px solid rgba(255,255,255,0.15)",
        background: "radial-gradient(circle at top, #1b1e2b, #050608)",
        color: "#f5f5f5",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        boxShadow: "0 18px 40px rgba(0,0,0,0.6)"
      }}
    >
      <h1 style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>
        Moon Chore Planner
      </h1>

      <label style={{ fontSize: "0.9rem", opacity: 0.9 }}>
        Choose a date:
        <input
          type="date"
          value={dateString}
          onChange={(e) => setDateString(e.target.value)}
          style={{
            marginLeft: "0.5rem",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.4rem",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(0,0,0,0.2)",
            color: "#f5f5f5"
          }}
        />
      </label>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          borderRadius: "0.9rem",
          // background slightly brighter when moon is fuller
          background: `rgba(0,0,0,${0.32 + (illumination ?? 0) * 0.12})`,
          border: "1px solid rgba(255,255,255,0.1)",
          // glow intensity scales with illumination (full moon => stronger glow)
          boxShadow: `0 8px ${8 + (illumination ?? 0) * 40}px rgba(255,240,200,${0.06 + (illumination ?? 0) * 0.28})`
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.3rem" }}>
          {phase.name}
        </h2>
        <p style={{ marginTop: "0.3rem", fontSize: "0.95rem", opacity: 0.9 }}>
          {phase.vibe}
        </p>
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        <h3 style={{ fontSize: "1rem", marginBottom: "0.4rem" }}>
          Suggested chores for this phase:
        </h3>
        <ul
          style={{
            paddingLeft: "1.2rem",
            margin: 0,
            display: "grid",
            gap: "0.35rem",
            fontSize: "0.95rem"
          }}
        >
          {chores.map((chore, idx) => (
            <li key={idx} style={{ lineHeight: 1.4 }}>
              {chore}
            </li>
          ))}
        </ul>
      </div>

      <p
        style={{
          marginTop: "1rem",
          fontSize: "0.8rem",
          opacity: 0.7
        }}
      >
        (Moon phase is approximate, but the vibes are absolutely real.)
      </p>
    </div>
  );
}
