import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * AtlasCountdown
 * Props:
 * - targetDate (ISO string) optional. If not provided, a sensible default is used.
 *
 * Notes / assumptions:
 * - The user didn't provide an official closest-approach date for "3I Atlas".
 *   This component uses a configurable target date and defaults to a sample date.
 *   You can change the default by passing `targetDate` prop or by editing the date/time in the UI.
 */
export default function AtlasCountdown({ targetDate }) {
  const DEFAULT_ISO = targetDate ?? '2026-12-01T00:00:00Z';

  // Countdown state
  const [targetIso, setTargetIso] = useState(() => DEFAULT_ISO);
  const [now, setNow] = useState(() => new Date());

  // Wish wall state
  const [alias, setAlias] = useState('');
  const [wishText, setWishText] = useState('');
  const [wishLog, setWishLog] = useState(() => [
    {
      id: 1,
      from: 'Ground Control',
      body: 'Safe voyage, 31atlas. Keep your ion tail tidy.',
      ts: new Date().toISOString()
    },
    {
      id: 2,
      from: 'Anonymous',
      body: 'If you pick up this transmission, bring back stories of the void.',
      ts: new Date().toISOString()
    }
  ]);

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const targetDateObj = new Date(targetIso);
  const diffMs = targetDateObj - now;
  const isPast = diffMs <= 0;

  const abs = Math.abs(diffMs);
  const days = Math.floor(abs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((abs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((abs / (1000 * 60)) % 60);
  const seconds = Math.floor((abs / 1000) % 60);

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  // Input handler for datetime-local (local time without timezone)
  function onDateTimeLocalChange(e) {
    const local = e.target.value;
    if (!local) return;
    const dt = new Date(local);
    if (!isNaN(dt)) {
      setTargetIso(dt.toISOString());
    }
  }

  // Prepare a value for datetime-local input: remove seconds and timezone
  function toDateTimeLocal(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  function onWishSubmit(e) {
    e.preventDefault();
    const trimmed = wishText.trim();
    if (!trimmed) return;
    const entry = {
      id: Date.now(),
      from: alias.trim() || 'Anonymous sender',
      body: trimmed,
      ts: new Date().toISOString()
    };
    setWishLog((prev) => [entry, ...prev].slice(0, 12));
    setWishText('');
  }

  return (
    <div className="atlas-card">
      <div className="atlas-card__header">
        <div>
          <p className="atlas-card__eyebrow">Rogue visitor bulletin</p>
          <h3 className="atlas-card__title">3I Atlas - closest approach</h3>
        </div>
        <span className="atlas-card__chip">Unconfirmed ephemeris</span>
      </div>

      <div aria-live="polite" className="atlas-count">
        {isPast ? (
          <div>
            <strong>Closest approach was</strong> {days}d {pad(hours)}:{pad(minutes)}:{pad(seconds)} ago
          </div>
        ) : (
          <div>
            <strong>Time until closest approach:</strong>
            <div className="atlas-count__timer">
              {days}d {pad(hours)}:{pad(minutes)}:{pad(seconds)}
            </div>
          </div>
        )}
      </div>

      <div className="atlas-input">
        <label>
          Set target date/time (local):
          <input
            aria-label="Set closest approach date and time"
            type="datetime-local"
            value={toDateTimeLocal(targetIso)}
            onChange={onDateTimeLocalChange}
          />
        </label>
        <div className="atlas-input__meta">
          Target (UTC): {isNaN(targetDateObj) ? 'invalid' : targetDateObj.toUTCString()}
        </div>
      </div>

      <div className="atlas-wish">
        <div className="atlas-wish__header">
          <div>
            <p className="atlas-wish__eyebrow">Ceremonial uplink</p>
            <h4>Send a wish to 31atlas</h4>
          </div>
          <span className="atlas-wish__note">Purely for vibes; nothing is transmitted.</span>
        </div>

        <form className="atlas-wish__form" onSubmit={onWishSubmit}>
          <input
            type="text"
            placeholder="Call sign (optional)"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
          <textarea
            placeholder="What do you want 31atlas to hear?"
            value={wishText}
            onChange={(e) => setWishText(e.target.value)}
            rows={3}
            required
          />
          <button type="submit">Pin it to the starboard</button>
        </form>

        <div className="atlas-wish__log" aria-live="polite">
          {wishLog.map((wish) => (
            <div key={wish.id} className="atlas-wish__item">
              <div className="atlas-wish__meta">
                <span className="atlas-wish__from">{wish.from}</span>
                <span className="atlas-wish__time">
                  {new Date(wish.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="atlas-wish__body">{wish.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

AtlasCountdown.propTypes = {
  targetDate: PropTypes.string
};
