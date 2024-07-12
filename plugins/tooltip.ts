import Tooltip from '~/components/Tooltip.vue'
import { h, render, createVNode } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tip', {
    mounted(el, binding, vnode) {

      const parent = document.createElement('div')

      el.replaceWith(parent)
      parent.appendChild(el)

      const tooltipElement = h(Tooltip, {
      }, {
        default: () => createVNode(vnode.type, vnode.props, vnode.children),
        tooltip: () => binding.value
      })
      el.remove()
      render(tooltipElement, parent)

    },
  })
})