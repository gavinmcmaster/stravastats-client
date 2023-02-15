import { createStore } from 'vuex'

export default createStore({
  state: {
    isAuthenticated: false,
    token: '',
    isLoading: false,
    stravaToken: {},
    stravaAthlete: {},
    stravaClient: {}
  },
  getters: {
  },
  mutations: {
    initializeStore(state) {
      if (localStorage.getItem('token')) {
          state.token = localStorage.getItem('token')
          state.isAuthenticated = true
      } else {
          state.token = ''
          state.isAuthenticated = false
      } 
    },
    setIsLoading(state, status) {
      state.isLoading = status
    },
    setToken(state, token) {
        state.token = token
        state.isAuthenticated = true
    },  
    removeToken(state) {
        state.token = ''
        state.isAuthenticated = false
    },
    setStravaToken(state, token) {
      state.stravaToken = token
    },
    setStravaAthlete(state, athlete) {
      state.stravaAthlete = athlete
    },
    setStravaClient(state, client) {
      state.stravaClient = client;
    }  
  },
  actions: {
  },
  modules: {
  }
})
