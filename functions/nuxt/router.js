import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _1d1f2143 = () => interopDefault(import('../pages/admin.vue' /* webpackChunkName: "pages/admin" */))
const _8f2b81a4 = () => interopDefault(import('../pages/game.vue' /* webpackChunkName: "pages/game" */))
const _37d159f4 = () => interopDefault(import('../pages/handicap.vue' /* webpackChunkName: "pages/handicap" */))
const _95511f46 = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _28a06574 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/admin",
    component: _1d1f2143,
    name: "admin"
  }, {
    path: "/game",
    component: _8f2b81a4,
    name: "game"
  }, {
    path: "/handicap",
    component: _37d159f4,
    name: "handicap"
  }, {
    path: "/login",
    component: _95511f46,
    name: "login"
  }, {
    path: "/",
    component: _28a06574,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
