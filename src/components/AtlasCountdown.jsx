import { useEffect, useState, useRef } from 'react';
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
  // Default target: example date (change as needed)
  const DEFAULT_ISO = targetDate ?? '2026-12-01T00:00:00Z';

  // Keep target as ISO string in UTC
  const [targetIso, setTargetIso] = useState(() => DEFAULT_ISO);
  const [now, setNow] = useState(() => new Date());
  const intervalRef = useRef(null);

  useEffect(() => {
    // update every second
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

  // input handler for datetime-local (local time without timezone)
  function onDateTimeLocalChange(e) {
    const local = e.target.value; // e.g. "2025-11-18T16:30"
    if (!local) return;
    // convert local to ISO by creating a Date from the local string
    const dt = new Date(local);
    if (!isNaN(dt)) {
      setTargetIso(dt.toISOString());
    }
  }

  // Prepare a value for datetime-local input: remove seconds and timezone
  function toDateTimeLocal(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    // get local YYYY-MM-DDTHH:MM
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  return (
    <div style={{ padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)', color: '#eee' }}>
      <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem' }}>3I Atlas — closest approach</h3>

      <div aria-live="polite" style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        {isPast ? (
          <div>
            <strong>Closest approach was</strong> {days}d {pad(hours)}:{pad(minutes)}:{pad(seconds)} ago
          </div>
        ) : (
          <div>
            <strong>Time until closest approach:</strong>
            <div style={{ fontFamily: 'monospace', marginTop: '0.25rem', fontSize: '1.05rem' }}>
              {days}d {pad(hours)}:{pad(minutes)}:{pad(seconds)}
            </div>
          </div>
        )}
      </div>

      <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>
        <label style={{ display: 'block', marginBottom: '0.25rem' }}>
          Set target date/time (local):
          <input
            aria-label="Set closest approach date and time"
            type="datetime-local"
            value={toDateTimeLocal(targetIso)}
            onChange={onDateTimeLocalChange}
            style={{
              display: 'block',
              marginTop: '0.25rem',
              padding: '0.25rem 0.4rem',
              borderRadius: '0.3rem',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent',
              color: '#fff'
            }}
          />
        </label>

        <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', opacity: 0.85 }}>
          Target (UTC): {isNaN(targetDateObj) ? 'invalid' : targetDateObj.toUTCString()}
        </div>
      </div>
    </div>
  );
}

AtlasCountdown.propTypes = {
  targetDate: PropTypes.string,
};

