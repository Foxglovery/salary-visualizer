import { useMemo, useState } from "react";

const MOON_PHASES = [
  {
    key: 0,
    name: "New Moon",
    vibe: "Reset, rest, intention-setting",
    phaseClass: "new",
    chores: [
      "Do light, low-effort tidying (clear one surface, not the whole house)",
      "Clean and reset your altar or a special shelf",
      "Journal goals or to-do lists for the next two weeks",
      "Sort seed packets, plan garden beds, but don't plant yet",
      "Declutter digital stuff: delete 10 old photos or emails"
    ]
  },
  {
    key: 1,
    name: "Waxing Crescent",
    vibe: "Plant the seeds, start small",
    phaseClass: "waxing-crescent",
    chores: [
      "Start small projects: one drawer, one cabinet, one bed in the garden",
      "Start seeds indoors or plan where transplants will go",
      "Do quick 10-15 minute cleaning bursts in different rooms",
      "Wash and prep containers/pots for upcoming plantings",
      "Begin tracking a new habit (sleep, water, cleaning, etc.)"
    ]
  },
  {
    key: 2,
    name: "First Quarter",
    vibe: "Action, push through resistance",
    phaseClass: "first-quarter",
    chores: [
      "Tackle medium-sized chores you've been avoiding (bathroom, fridge, car)",
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
    phaseClass: "waxing-gibbous",
    chores: [
      "Fine-tune spaces you already cleaned (organize, pretty it up)",
      "Thin seedlings, prune lightly, or adjust plant spacing",
      "Batch prep ingredients or freezer meals for future you",
      "Label everything you've been saying you'll label for weeks",
      "Do maintenance: sharpen tools, oil cutting boards, fix squeaky doors"
    ]
  },
  {
    key: 4,
    name: "Full Moon",
    vibe: "Peak energy, showcase & cleanse",
    phaseClass: "full",
    chores: [
      "Do a big 'showtime' clean of main living areas",
      "Wash bedding, blankets, and anything cozy",
      "Sweep and energetically cleanse floors/thresholds",
      "Show off your space: take photos, host a little hang, or just enjoy it",
      "Moon-gaze with tea and actually admire what you've done"
    ]
  },
  {
    key: 5,
    name: "Waning Gibbous",
    vibe: "Gratitude, sharing, adjusting",
    phaseClass: "waning-gibbous",
    chores: [
      "Declutter gently: donate or re-home items you don't use",
      "Harvest and share herbs/produce, or prep them for drying",
      "Clean out the pantry of stale/expired things",
      "Write labels, notes, or logs for what worked well this cycle",
      "Do laundry that's been lurking in baskets or corners"
    ]
  },
  {
    key: 6,
    name: "Last Quarter",
    vibe: "Release, cut away, tough love",
    phaseClass: "last-quarter",
    chores: [
      "Do a ruthless declutter of one category (mugs, t-shirts, etc.)",
      "Prune plants more firmly, remove diseased/dead growth",
      "Unsubscribe from junk emails and silence annoying notifications",
      "Take out trash and recycling from every room",
      "Deal with that one 'doom pile' of papers or random stuff"
    ]
  },
  {
    key: 7,
    name: "Waning Crescent",
    vibe: "Rest, reset, compost the old",
    phaseClass: "waning-crescent",
    chores: [
      "Soft reset: gentle tidy, nothing heroic",
      "Compost kitchen scraps, dead plants, or old intentions",
      "Wash your favorite mug, blanket, and comfy clothes",
      "Prep a cozy corner for the next New Moon planning session",
      "Take notes: what do you NOT want to drag into the next cycle?"
    ]
  }
];

// Conway-style moon phase approximation: returns 0-7
function getMoonPhaseIndex(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1; // JS months 0-11 + 1-12
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
  const day =
    date.getDate() +
    date.getHours() / 24 +
    date.getMinutes() / 1440 +
    date.getSeconds() / 86400;

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

const ARC_POSITIONS = (() => {
  const radiusX = 48; // horizontal spread (percent of container width)
  const radiusY = 38; // vertical spread
  const verticalCenter = 80; // percentage from top
  return MOON_PHASES.map((phase, idx) => {
    const t = idx / (MOON_PHASES.length - 1);
    const angleDeg = 180 - t * 180; // left to right along top arc
    const angleRad = (angleDeg * Math.PI) / 180;
    const xPerc = 50 + radiusX * Math.cos(angleRad);
    const yPerc = verticalCenter - radiusY * Math.sin(angleRad);
    return { ...phase, xPerc, yPerc };
  });
})();

export default function MoonChorePlanner() {
  const [dateString, setDateString] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const { phase, chores, illumination, phaseIndex } = useMemo(() => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const currentPhaseIndex = getMoonPhaseIndex(date);
    const phaseInfo = MOON_PHASES.find((p) => p.key === currentPhaseIndex) ?? MOON_PHASES[0];
    const illum = getMoonIllumination(date);
    return {
      phase: phaseInfo,
      chores: phaseInfo.chores,
      illumination: illum,
      phaseIndex: currentPhaseIndex
    };
  }, [dateString]);

  return (
    <section className="moon-panel">
      <div className="moon-panel__header">
        <div>
          <p className="moon-panel__eyebrow">Arcane horary // domestic augury</p>
          <h2 className="moon-panel__title">Moon Phase Tracker</h2>
        </div>
        <label className="moon-panel__date">
          <span>Inscribed night:</span>
          <input
            type="date"
            value={dateString}
            onChange={(e) => setDateString(e.target.value)}
          />
        </label>
      </div>

      <div className="moon-arc">
        <div
          className="moon-arc__halo"
          style={{
            opacity: 0.55 + (illumination ?? 0) * 0.25,
            boxShadow: `0 0 120px 50px rgba(240, 220, 170, ${0.08 + (illumination ?? 0) * 0.35})`
          }}
        />
        <div className="moon-arc__band" />
        {ARC_POSITIONS.map((p) => (
          <div
            key={p.key}
            className={`phase-node ${phaseIndex === p.key ? "is-active" : ""}`}
            style={{ left: `${p.xPerc}%`, top: `${p.yPerc}%` }}
            aria-label={`${p.name} phase`}
          >
            <div className={`phase-node__disk ${p.phaseClass}`}>
              <span className="phase-node__glow" />
            </div>
            <div className="phase-node__label">{p.name}</div>
          </div>
        ))}
      </div>

      <div
        className="moon-phase-card"
        style={{
          boxShadow: `0 18px ${18 + (illumination ?? 0) * 32}px rgba(0,0,0,0.5), 0 0 ${
            14 + (illumination ?? 0) * 40
          }px rgba(240,210,150,${0.1 + (illumination ?? 0) * 0.4})`
        }}
      >
        <div className="moon-phase-card__header">
          <div className="moon-phase-card__title">
            <span className="moon-phase-card__glyph" aria-hidden="true">
              ☾
            </span>
            <div>
              <p className="moon-phase-card__eyebrow">Current aspect</p>
              <h3>{phase.name}</h3>
            </div>
          </div>
          <p className="moon-phase-card__vibe">{phase.vibe}</p>
        </div>
        <div className="moon-phase-card__list">
          {chores.map((chore, idx) => (
            <div key={idx} className="moon-phase-card__item">
              <span className="moon-phase-card__bullet" aria-hidden="true">
                ✧
              </span>
              <span>{chore}</span>
            </div>
          ))}
        </div>
        <p className="moon-panel__footnote">
          Shadows are approximate; the witching hour is exact.
        </p>
      </div>
    </section>
  );
}
