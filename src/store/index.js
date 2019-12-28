import Vue from 'vue'
import Vuex from 'vuex'
import {state} from './state.js'
import * as getters from './getters.js'
import * as actions from './action.js'
import {mutations} from './mutation.js'

Vue.use(Vuex)

export default new Vuex.Store({
   state,
   getters,
   mutations,
   actions

})
