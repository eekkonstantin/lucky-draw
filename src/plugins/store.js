import Vue from "vue"
import Vuex from "vuex"
import VuexPersist from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [VuexPersist()],
  state: {
    names: [],
    prizes: [],
    roles: []
  },
  mutations: {
    addNames(state, nl) {
      state.names = nl
      if (nl.length == 0)
        state.roles = []
    },
    addPrizes(state, nl) {
      state.prizes = nl
    },
    setRoles(state, roles) {
      state.roles = roles
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
