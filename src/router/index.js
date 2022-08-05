import Vue from 'vue'
import VueRouter from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import Login from "../views/Login.vue"
/*import Register from "../views/Register.vue" */
import Dashboard from "../views/Dashboard.vue"
import DefaultLayout from '@/layouts/DefaultLayout'
import NotFound from '@/views/NotFound.vue';

Vue.use(VueRouter)

Vue.prototype.$base = 'htpp://localhost/auxicam-back/public/index.php/api/';

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: "/passChange",
    name: "PassChange",
    component: function () {
      return import('../views/PassChange.vue')
    },
    meta: { authOnly: true }
  },
  {
    path: '*',
    name: 'Not Found',
    component: NotFound
  },
  {
    path: '/',
    name: 'home',
    component: DefaultLayout,
    redirect: '/dashboard',
    children:[
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { authOnly: true }
      },
      {
        path: "/vincular",
        name: "Vincular",
        component:function () {
          return import('../views/Vincular.vue')
        },
        meta: { authOnly: true }
      },
      {
        path: "/historial",
        name: "Historial",
        component: function () {
          return import('../views/Historial.vue')
        },
        meta: { authOnly: true }
      },
      {
        path: '/about',
        name: 'about',
        component: function () {
          return import('../views/AboutView.vue')
        }
      },
      {
        path: '/cambiarPass',
        name: 'CambiarPass',
        component: function () {
          return import('../views/PassChange.vue')
        },
        meta: { authOnly: true }
      },
    ]
  },
/*   {
    path: '/about',
    name: 'about',
    component: function () {
      return import('../views/AboutView.vue')
    }
  }, */
  /* {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: { authOnly: true }
  },
  {
    path: "/vincular",
    name: "Vincular",
    component:function () {
      return import('../views/Vincular.vue')
    },
    meta: { authOnly: true }
  },
  {
    path: "/historial",
    name: "Historial",
    component: function () {
      return import('../views/Historial.vue')
    },
    meta: { authOnly: true }
  },
  {
    path: "/passChange",
    name: "PassChange",
    component: function () {
      return import('../views/PassChange.vue')
    },
    meta: { authOnly: true }
  }, */
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

function isLoggedIn() {
  return localStorage.getItem("auth");
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authOnly)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!isLoggedIn()) {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guestOnly)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (isLoggedIn()) {
      next({
        path: "/dashboard",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});

export default router
