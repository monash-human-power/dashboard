const initialState = {
  gps: false,
  power: false,
  cadence: false,
  reed: false,
  accelerometer: false,
  gyroscope: false,
  potentiometer: false,
  thermometer: false,
};

const mutations = {
  setSensorStatus(state, { sensor, sensorState }) {
    state[sensor] = sensorState;
  },
};

const actions = {
  setSensorStatus(context, payload) {
    context.commit('setSensorStatus', payload);
  },
};

export default {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
};
