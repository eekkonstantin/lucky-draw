import Vue from "vue"
import Vuex from "vuex"
import VuexPersist from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [VuexPersist()],
  state: {
    names: [],
    prizes: [],

    prizeRange: {
      GTAP4: [1, 10],
      SMC: [0, 0],
      Others: [1, 10],
    }
  },
  mutations: {
    addNames(state, nl) {
      state.names = nl
    },
    addPrizes(state, nl) {
      state.prizes = nl
    },
    setPrizeRange(state, role, numlist) {
      state.prizeRange[role] = numlist || [0, 0]
    },
    clearAll(state) {
      state.names = []
      state.prizes = []
      state.prizeRange = {
        GTAP4: [1, 10],
        SMC: [0, 0],
        Others: [1, 10],
      }
    }
  },
  actions: {
  }
});
