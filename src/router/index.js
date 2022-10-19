import Vue from 'vue'
import VueRouter from 'vue-router'
import Edit from '../views/Edit.vue'
import Register from '../views/Register.vue'
import Projects from '../views/Projects.vue'
import Login from '../views/Login.vue'
import RegisterUser from '../views/RegisterUser.vue'

Vue.use(VueRouter)

const routes = [
  //{
  //  path: '/',
  //  name: 'home',
  //  component: Login
  //},
  {
    path: '/edit',
    name: 'edit',
    component: Edit
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/user',
    name: 'user',
    component: RegisterUser
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== "login" && to.name !== "user" && !localStorage.getItem("authUser")) {
    next({ name: "login" });
  } else if ((to.name == "login" && localStorage.getItem("authUser")) || (to.name == "user" && localStorage.getItem("authUser"))) {
    window.alert("Faça logout para acessar essa rota")
    next({ name: "projects" });
  } else if (to.name !== "projects" && to.name !== "register" && to.name !== "edit" && to.name !== "login" && to.name !== "user") {
    next({ name: "projects" });
  } else {
    next();
  }
});

//router.beforeEach((to, from, next) => {
//  if (to.name !== "login" && to.name !== "user" && !localStorage.getItem("authUser")) {
//    next({ name: "login" });
//  } else if ((to.name == "login" && localStorage.getItem("authUser")) || (to.name == "user" && localStorage.getItem("authUser"))) {
//    window.alert("Faça logout para acessar essa rota")
//    next({ name: "projects" });
//  } else {
//    next();
//  }
//});

export default router
