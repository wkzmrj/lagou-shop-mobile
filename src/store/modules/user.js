const state = {
    token: window.localStorage.getItem('USER_TOKEN'),

}
const getters = {}
const mutations = {
    setUser(state, payload) {
        state.token = payload
        window.localStorage.setItem('USER_TOKEN', payload)
    },
}
const actions = {}


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}

