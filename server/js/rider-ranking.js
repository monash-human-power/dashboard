// Sample-weighted scores: all valid assigned samples across every stint count.
function advanceRiders(state, record) {
  state.total += 1;
  const rider = state.riders.find((entry) => entry.id === record.riderId);
  if (!rider) return;
  const { speed, power } = record.data;
  if (
    speed.unit !== 'km/h' ||
    power.unit !== 'W' ||
    speed.value < 0 ||
    power.value < 0
  ) {
    rider.excluded += 1;
    return;
  }
  rider.count += 1;
  rider.speed += (speed.value - rider.speed) / rider.count;
  const delta = power.value - rider.power;
  rider.power += delta / rider.count;
  rider.m2 += delta * (power.value - rider.power);
}

function newRider(id, name) {
  return { id, name, count: 0, excluded: 0, speed: 0, power: 0, m2: 0 };
}

function riderSnapshot(state, sessionId) {
  const cap = (value) => Math.max(0, Math.min(100, value));
  return {
    sessionId,
    version: state.total + state.revision,
    activeRiderId: state.activeRiderId,
    riders: state.riders.map((rider) => {
      const efficiency = rider.speed > 0 ? rider.power / rider.speed : null;
      const cv =
        rider.power > 0
          ? (Math.sqrt(Math.max(0, rider.m2 / rider.count)) / rider.power) * 100
          : null;
      const speed = cap((rider.speed / 45) * 100);
      const power = cap((rider.power / 250) * 100);
      const eff =
        efficiency === null
          ? 0
          : efficiency === 0
          ? 100
          : cap((5.5 / efficiency) * 100);
      const consistency =
        cv === null ? 0 : cv === 0 ? 100 : cap((8 / cv) * 100);
      // One reading cannot establish consistency. Show a provisional row instead.
      const scores =
        rider.count < 2
          ? null
          : {
              speed,
              efficiency: eff,
              power,
              consistency,
              total: (speed + eff + power + consistency) / 4,
            };
      return {
        id: rider.id,
        name: rider.name,
        samples: rider.count,
        excluded: rider.excluded,
        averageSpeed: rider.speed,
        averagePower: rider.power,
        efficiency,
        cv,
        scores,
      };
    }),
  };
}

module.exports = { advanceRiders, newRider, riderSnapshot };
