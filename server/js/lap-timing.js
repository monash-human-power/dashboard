// Pure receipt-order timing calculation, shared by live recording and history replay.
function createTiming(checkpoints = []) {
  return { checkpoints, lapCount: 0, lastSegment: null, segmentHistory: {},
    currentSegmentElapsedSec: 0, currentLapElapsedSec: 0,
    lapStart: null, segmentStart: null, lastTime: null, target: 0, armed: false };
}

function distance(point, gps) {
  const radians = Math.PI / 180;
  const a = Math.sin((gps.latitude - point.lat) * radians / 2) ** 2
    + Math.cos(point.lat * radians) * Math.cos(gps.latitude * radians)
    * Math.sin((gps.longitude - point.long) * radians / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
}

function advanceTiming(state, record) {
  if (!state.checkpoints.length) return state;
  const time = Date.parse(record.timestamp);
  if (!Number.isFinite(time) || time === state.lastTime) return state;
  if (state.lastTime !== null && time < state.lastTime) {
    // A restarted replay/clock starts a new partial lap, never a negative lap.
    state.lapStart = null;
    state.segmentStart = null;
    state.target = 0;
    state.armed = false;
    state.currentLapElapsedSec = 0;
    state.currentSegmentElapsedSec = 0;
  }
  state.lastTime = time;
  const gps = record.data.gps;
  const near = distance(state.checkpoints[state.target], gps) <= 12;
  if (state.lapStart === null) {
    if (!near) return state;
    state.lapStart = time;
    state.segmentStart = time;
    state.target = state.checkpoints.length > 1 ? 1 : 0;
    state.armed = distance(state.checkpoints[state.target], gps) > 15;
    return state;
  }
  state.currentSegmentElapsedSec = (time - state.segmentStart) / 1000;
  state.currentLapElapsedSec = (time - state.lapStart) / 1000;
  if (distance(state.checkpoints[state.target], gps) > 15) state.armed = true;
  if (!near || !state.armed || time <= state.segmentStart) return state;
  const completedLap = state.target === 0;
  const label = `Segment ${completedLap ? state.checkpoints.length : state.target}`;
  const lapNumber = state.lapCount + 1;
  const durationSec = state.currentSegmentElapsedSec;
  state.lastSegment = { label, durationSec };
  if (!state.segmentHistory[label]) state.segmentHistory[label] = [];
  state.segmentHistory[label].push({ lapNumber, durationSec });
  if (completedLap) {
    if (!state.segmentHistory['Full Lap']) state.segmentHistory['Full Lap'] = [];
    // Capture duration before resetting the start; segments telescope to this sum.
    state.segmentHistory['Full Lap'].push({ lapNumber, durationSec: state.currentLapElapsedSec });
    state.lapCount += 1;
    state.lapStart = time;
    state.currentLapElapsedSec = 0;
  }
  state.segmentStart = time;
  state.currentSegmentElapsedSec = 0;
  state.target = (state.target + 1) % state.checkpoints.length;
  state.armed = distance(state.checkpoints[state.target], gps) > 15;
  return state;
}

module.exports = { createTiming, advanceTiming };
