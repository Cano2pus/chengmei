import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token: "",
        domain: "http://chengmei_dev.wanxikeji.cn/"
    },
    getters:{
        getToken(state){
            return state.token
        },
        getDomain(state){
            return state.domain
        }
    },
    mutations:{
        setToken(state, value){
            state.token = value
        }
    }
});
export default store