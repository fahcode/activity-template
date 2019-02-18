import Vuex from 'vuex'
import Vue from 'vue'
import { state, mutations, actions } from './state'

Vue.use(Vuex);

export default new Vuex.Store({
    state,
    mutations,
    actions
});