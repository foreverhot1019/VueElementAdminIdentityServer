import Vue from 'vue'
import Router from 'vue-router'
import lazyLoadView from '../components/public/lazyLoadView'
import menus from './config'

Vue.use(Router)

// const Home = () => lazyLoadView(import('@/Views/Home/Home.vue'))
// const Contact = () => lazyLoadView(import('@/Views/Contact/Contact.vue'))
// const About = () => lazyLoadView(import('@/Views/About/About.vue'))
var routes = []

menus.forEach((item) => {
  item.sub.forEach((sub) => {
    routes.push({
      path: `/${sub.componentName}`,
      name: sub.componentName,
      component: () => lazyLoadView(import(`@/components/${sub.componentName}`))
    })
  })
  item.group.forEach((sub) => {
    routes.push({
      path: `/${sub.componentName}`,
      name: sub.componentName,
      component: () => lazyLoadView(import(`@/components/${sub.componentName}`))
    })
  })
  routes.push({
    path: `/${item.componentName}`,
    name: item.componentName,
    component: () => lazyLoadView(import(`@/views/${item.componentName}/${item.componentName}.vue`))
  })
})
var router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})
export default router
