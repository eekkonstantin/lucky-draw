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
    wonPrize(state, nameID, prizeID) {
      state.names[nameID].won = prizeID
      state.prizes[prizeID].wonBy = nameID
    },
    addPrizes(state, nl) {
      state.prizes = nl
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
