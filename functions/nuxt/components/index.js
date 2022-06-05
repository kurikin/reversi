export const AdminSquare = () => import('../../components/AdminSquare.vue' /* webpackChunkName: "components/admin-square" */).then(c => wrapFunctional(c.default || c))
export const Message = () => import('../../components/Message.vue' /* webpackChunkName: "components/message" */).then(c => wrapFunctional(c.default || c))
export const Square = () => import('../../components/Square.vue' /* webpackChunkName: "components/square" */).then(c => wrapFunctional(c.default || c))

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
