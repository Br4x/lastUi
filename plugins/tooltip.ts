import Tooltip from '~/components/Tooltip.vue'
import { h, render, createVNode } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tip', {
    mounted(el, binding, vnode) {
      if(!binding.value) return
      const parent = el.cloneNode(false)

      el.replaceWith(parent)

        // Traiter correctement vnode.children
        const children =
        Array.isArray(vnode.children)
          ? vnode.children
          : vnode.children
          ? [vnode.children] // Mettre dans un tableau s'il s'agit d'un objet ou d'une chaîne
          : [];

      //parent.appendChild(el)
      const tooltipElement = h(Tooltip, {
      }, {
        default: () => children, // array with children else it break the devtools
        tooltip: () => binding.value
      })
      //el.remove()
      render(tooltipElement, parent)

    },
  })
})