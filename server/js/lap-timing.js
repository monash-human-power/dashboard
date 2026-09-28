// Pure receipt-order timing calculation, shared by live recording and history replay.
function createTiming(checkpoints = []) {
  return {
    checkpoints,
    lapCount: 0,
    lastSegment: null,
    segmentHistory: {},
    currentSegmentElapsedSec: 0,
    currentLapElapsedSec: 0,
    lapStart: null,
    segmentStart: null,
    lastTime: null,
    // One "armed" flag per checkpoint — true once the rider has moved far
    // enough away that coming back close again counts as a genuine new
    // crossing, not lingering nearby.
    armed: checkpoints.map(() => false),
  };
}

function distance(point, gps) {
  const radians = Math.PI / 180;
  const a =
    Math.sin(((gps.latitude - point.lat) * radians) / 2) ** 2 +
    Math.cos(point.lat * radians) *
      Math.cos(gps.latitude * radians) *
      Math.sin(((gps.longitude - point.long) * radians) / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
}

function recordCrossing(state, label, lapNumber, durationSec) {
  state.lastSegment = { label, durationSec };
  if (!state.segmentHistory[label]) state.segmentHistory[label] = [];
  state.segmentHistory[label].push({ lapNumber, durationSec });
}

function advanceTiming(state, record) {
  if (!state.checkpoints.length) return state;
  const time = Date.parse(record.timestamp);
  if (!Number.isFinite(time) || time === state.lastTime) return state;
  if (state.lastTime !== null && time < state.lastTime) {
    // A restarted replay/clock starts a new partial lap, never a negative lap.
    state.lapStart = null;
    state.segmentStart = null;
    state.armed = state.checkpoints.map(() => false);
    state.currentLapElapsedSec = 0;
    state.currentSegmentElapsedSec = 0;
  }
  state.lastTime = time;
  const gps = record.data.gps;

  // Re-arm any checkpoint the rider has moved far enough away from
  state.checkpoints.forEach((cp, i) => {
    if (distance(cp, gps) > 15) state.armed[i] = true;
  });

  if (state.lapStart === null) {
    // Not started yet — only a genuine Start/Finish crossing begins timing
    if (distance(state.checkpoints[0], gps) > 12) return state;
    state.lapStart = time;
    state.segmentStart = time;
    state.armed = state.checkpoints.map(() => false);
    return state;
  }

  state.currentSegmentElapsedSec = (time - state.segmentStart) / 1000;
  state.currentLapElapsedSec = (time - state.lapStart) / 1000;

  // Start/Finish always takes priority: crossing it finishes a lap
  // immediately, no matter which other checkpoints have or haven't been
  // reached yet — this is what stops a mis-ordered point from silently
  // delaying lap detection.
  const start = state.checkpoints[0];
  if (
    state.armed[0] &&
    distance(start, gps) <= 12 &&
    time > state.segmentStart
  ) {
    const lapNumber = state.lapCount + 1;
    recordCrossing(
      state,
      start.label,
      lapNumber,
      state.currentSegmentElapsedSec,
    );
    if (!state.segmentHistory['Full Lap'])
      state.segmentHistory['Full Lap'] = [];
    state.segmentHistory['Full Lap'].push({
      lapNumber,
      durationSec: state.currentLapElapsedSec,
    });
    state.lapCount += 1;
    state.lapStart = time;
    state.segmentStart = time;
    state.currentLapElapsedSec = 0;
    state.currentSegmentElapsedSec = 0;
    state.armed[0] = false;
    return state;
  }

  // Otherwise, check every other checkpoint independently — whichever one
  // the rider has actually reached (in whatever order) gets credited under
  // its own stored label.
  for (let i = 1; i < state.checkpoints.length; i += 1) {
    const cp = state.checkpoints[i];
    if (
      state.armed[i] &&
      distance(cp, gps) <= 12 &&
      time > state.segmentStart
    ) {
      const lapNumber = state.lapCount + 1;
      recordCrossing(
        state,
        cp.label,
        lapNumber,
        state.currentSegmentElapsedSec,
      );
      state.segmentStart = time;
      state.currentSegmentElapsedSec = 0;
      state.armed[i] = false;
      break; // only one checkpoint crossing recorded per telemetry point
    }
  }

  return state;
}

module.exports = { createTiming, advanceTiming };
