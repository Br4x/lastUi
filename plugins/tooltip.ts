import Tooltip from '~/components/Tooltip.vue'
import { h, render } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tip', {
    mounted(el, binding) {
      if (!binding.value) return;

      // Stocker l'instance de composant
      const tooltipInstance = h(
        Tooltip,
        {
          viaDirective: true,
          focusedElement: el
        },
        {
          tooltip: () => binding.value,
        }
      );

      // Rendre le tooltip
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      // Rendre le composant et stocker la référence
      const vnode = render(tooltipInstance, container);
      
      // Stocker la référence sur l'élément pour pouvoir la nettoyer plus tard
      el._tooltip_container = container;
      el._tooltip_vnode = vnode;
    },
    unmounted(el) {
      // Nettoyer lors du démontage
      if (el._tooltip_container) {
        render(null, el._tooltip_container);
        el._tooltip_container.remove();
      }
    }
  });
});
