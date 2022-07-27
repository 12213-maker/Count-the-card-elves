import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authenticated: false,
    show404: false,
    dateTime:''
  },
  
  mutations: {
    setAuthenticated(state,flag) {
      state.authenticated = flag;
      state.show404 = !flag
    },

    setShow404(state, flag) {
      state.show404 = flag;
    },

    setDateTime(state,data) {
      state.dateTime = data;
    }
  },
  actions: {
  	
  },
  modules: {}
});
