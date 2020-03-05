import Vue from 'vue'
import store from './store'
import Router from 'vue-router'
import Home from './views/Home.vue'
import User from './components/User.vue'
import Role from './components/Role.vue'  
import Schedule from './components/Schedule.vue'
import Order from './components/Order.vue'
import MedicalEquipment from './components/MedicalEquipment.vue'
import MachineReview from './components/MachineReview.vue'
import FinalReport from './components/FinalReport.vue'
import Login  from './components/Login.vue'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta:{
        admin:true,
        engineer:true,
        doctor:true
      }
    },
    {
      path: '/users',
      name:'users',
      component: User,
      meta:{
        admin:true,
      }
    },

    {
      path: '/roles',
      name:'roles',
      component: Role,
      meta:{
        admin:true,
      }
    },
 

     {
      path: '/finalreports',
      name: 'finalreports',
      component: FinalReport,
       meta:{
        admin:true,
        doctor:true
      }
    },

    {
      path: '/machinereviews',
      name: 'machinereviews',
      component: MachineReview,
      meta:{
        admin:true,
        engineer:true,
        doctor:true
      }
    },


   
    {
      path: '/schedules',
      name: 'schedules',
      component: Schedule,  
      meta:{
        admin:true,
        engineer:true,
        doctor:true
      }
    },

    {
      path: '/orders',
      name: 'orders',
      component: Order,
      meta:{
        admin:true,
        doctor:true,
      }
    },
    {
      path: '/medicalequipments',
      name: 'medicalequipments',
      component: MedicalEquipment,
      meta:{
        admin:true,
        doctor:true,
      }
    },

    {
      path: '/login',
      name: 'login',
      component: Login,
      meta:{
        libre:true
      } 
    },
  ]
})
//Para acceder a la ruta sin logerate, la unica es el que tiene el meta libre
router.beforeEach( (to, from, next) => {
  //mediante este metodo comparo que la ruta posea el meta libre si es asi se podrá acceder a ella
  if(to.matched.some(record => record.meta.libre))
  {
    next()
  }

 if(store.state.user && store.state.user.rol == 'Admin')
  {
    
    if(to.matched.some(record => record.meta.admin))
    {
      next()
    }
  }

  else if(store.state.user && store.state.user.rol == 'Engineer')
  {
    if(to.matched.some(record => record.meta.engineer))
    {
      next()
    }
  }

  else if(store.state.user && store.state.user.rol == 'Doctor')
  {
    if(to.matched.some(record => record.meta.doctor))
    {
      next()
    }
  }

  else
  {
    next({name: 'home'})
  }

})
 
export default router