import Vue from 'vue';
import Vuex from 'vuex';
import { dateFormat } from '../utils/index'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authenticated: false,
    show404: false,
    dateTime: '',
    result1: {
      value1: [],
      value2: [],
      value3: []
    },
    result2: {
      value1: [],
      value2: [],
      value3: []
    },
    //报表时效中的datetime
    date:'',
    title:''
  },
  getters:{
    newdate(state){
      if(state.date=='')
      {
        return ''
      }
      return new Date(state.date)
    }
  },

  mutations: {
    setTitle(state,value){
      state.title = value
    },
    setDate(state,value){
      state.date = value
    },
    setResult1(state, { flag, trueValue }) {
      if (flag == 0) {
        state.result1.value1 = trueValue
        state.result1.value2 = trueValue
        state.result1.value3 = trueValue
      } else if (flag == 1) {
        state.result1.value1 = trueValue
      } else if (flag == 2) {
        state.result1.value2 = trueValue
      } else {
        state.result1.value3 = trueValue
      }
    },
    setResult2(state, { flag, trueValue }) {
      if (flag == 0) {
        state.result2.value1 = trueValue
        state.result2.value2 = trueValue
        state.result2.value3 = trueValue
      } else if (flag == 1) {
        state.result2.value1 = trueValue
      } else if (flag == 2) {
        state.result2.value2 = trueValue
      } else {
        state.result2.value3 = trueValue
      }
    },
    setAuthenticated(state, flag) {
      state.authenticated = flag;
      state.show404 = !flag
    },

    setShow404(state, flag) {
      state.show404 = flag;
    },

    setDateTime(state, data) {
      // const myDate = dateFormat(data,'yyyy-MM-dd HH:mm:ss')
      // state.dateTime = myDate;
      state.dateTime = data;
    }
  },
  actions: {

  },
  modules: {}
});
