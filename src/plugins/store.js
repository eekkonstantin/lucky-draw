import Vue from "vue"
import Vuex from "vuex"
import VuexPersist from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [VuexPersist()],
  state: {
    names: [],
    prizes: [],
    roles: [],
    page: null,
  },
  mutations: {
    addNames(state, nl) {
      state.names = nl
      if (nl.length == 0)
        state.roles = []
    },
    wonPrize(state, win) {
    let curWinner = state.prizes[win[1]].wonBy
    if (curWinner)
      state.names[curWinner].won = null
    state.names[win[0]].won = win[1]
    state.prizes[win[1]].wonBy = win[0]
    },
    addPrizes(state, nl) {
      state.prizes = nl
    },
    // for dev
    clearPrizes(state) {
      state.names.forEach(x => x.won = null)
      state.prizes.forEach(p => p.wonBy = null)
    },
    clearPrize(state, prizeID) {
      let nID = state.prizes[prizeID].wonBy
      state.prizes[prizeID].wonBy = null
      if (nID)
        state.names[nID].won = null
    },
    setRoles(state, roles) {
      state.roles = roles
    },
    setPage(state, p) {
      state.page = p
    },
    clearAll(state) {
      state.names = []
      state.prizes = []
      state.roles = []
    }
  },
  actions: {
  }
});
