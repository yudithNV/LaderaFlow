import { createRouter, createWebHistory } from 'vue-router'
import IntroduccionView from '../views/IntroduccionView.vue'
import ProblemaView from '../views/ProblemaView.vue'
import ObjetivosView from '../views/ObjetivosView.vue'
import MarcoTeoricoView from '../views/MarcoTeoricoView.vue'
import AplicacionView from '../views/AplicacionView.vue'
import ConclusionesView from '../views/ConclusionesView.vue'

const routes = [
  { path: '/', redirect: '/introduccion' },
  { path: '/introduccion', name: 'introduccion', component: IntroduccionView },
  { path: '/problema', name: 'problema', component: ProblemaView },
  { path: '/objetivos', name: 'objetivos', component: ObjetivosView },
  { path: '/marco-teorico', name: 'marco-teorico', component: MarcoTeoricoView },
  { path: '/aplicacion', name: 'aplicacion', component: AplicacionView },
  { path: '/conclusiones', name: 'conclusiones', component: ConclusionesView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
