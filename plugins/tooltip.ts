import Tooltip from '~/components/Tooltip.vue'
import { h, render } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tip', {
    mounted(el, binding) {
      if (!binding.value) return; // Ne rien faire si aucune valeur n'est passée

      // Créer le composant Tooltip
      const tooltipElement = h(
        Tooltip,
        {
          viaDirective: true,
          focusedElement: el
        },
        {
          tooltip: () => binding.value, // Passer la valeur de la directive comme prop
        }
      );

      // Rendu du Tooltip dans le conteneur cloné
      render(tooltipElement, document.body);
    },
  });
});
