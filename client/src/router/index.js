import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/register',
    name: 'register',
    component: ()=> import('../views/Register/Register') 
  },
  {
    path: '/login',
    name: 'login',
    component: ()=> import('../views/Login/Login') 
  },
  {
    path: '/',
    name: 'main',
    component: ()=> import('../views/Main'),
    children:[
      {
        path:'/',
        name:'home',
        component:()=> import('../views/home/Home')
      },
      {
        path:'/infoshow',
        name:'infoshow',
        component:()=> import('../views/infoShow/infoShow')
      },
      {
        path:'/fundlist',
        name:'fundlist',
        component:()=> import('../views/FundList/FundList')
      }
    ]
  },
  
  {
    path:'*',
    name:"404",
    component:()=>import ('../views/404/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//路由守卫

router.beforeEach((to,from,next)=>{
  const isLogin=localStorage.mytoken ? true : false
  if(to.path=='/login'||to.path=='/register'){
    next()
  }
  else{
    isLogin?next():next('/login')
  }
})

export default router
