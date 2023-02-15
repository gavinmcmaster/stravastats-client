import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import MyDashboard from '../views/MyDashboard.vue'
import Signup from '../views/Signup.vue'
import AddAthlete from '../views/AddAthlete.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/sign-up',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/log-in',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'MyDashboard',
    component: MyDashboard,
    meta: {
        requireLogin: true
    }
  },
  {
    path: '/add-athlete',
    name: 'AddAthlete',
    component: AddAthlete,
    meta: {
        requireLogin: true
    }
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireLogin) && !store.state.isAuthenticated) {
    next({ name: 'Login', query: { to: to.path } });
  } else {
    next()
  }
})

export default router
