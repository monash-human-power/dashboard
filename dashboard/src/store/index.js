import Vue from 'vue';
import Vuex from 'vuex';
import sensorStatus from './modules/sensorStatus';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    sensorStatus,
  },
});
