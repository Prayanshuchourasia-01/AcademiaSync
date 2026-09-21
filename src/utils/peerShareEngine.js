/**
 * Peer Schedule Sharing & URL Hash Encoder Engine
 * Encodes timetable state into base64 URL strings for sharing with study group peers.
 */

export const encodeScheduleShareURL = (schedule = []) => {
  try {
    const compact = schedule.map(b => ({ id: b.id, d: b.date, t: b.title }));
    const json = JSON.stringify(compact);
    const b64 = btoa(json);
    return `${window.location.origin}${window.location.pathname}#share=${b64}`;
  } catch (err) {
    return window.location.href;
  }
};
