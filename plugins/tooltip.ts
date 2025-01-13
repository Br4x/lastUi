import Tooltip from '~/components/Tooltip.vue'
import { h, render, createVNode } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tip', {
    mounted(el, binding, vnode) {
      if (!binding.value) return; // Ne rien faire si aucune valeur n'est passée

      // Cloner l'élément pour conserver ses styles et attributs
      const parent = el.cloneNode(false); // Ne pas cloner les enfants
      el.replaceWith(parent);

      // Traiter les différents formats de vnode.children
      let children = [];

      if (Array.isArray(vnode.children)) {
        // Si c'est un tableau, on l'utilise tel quel
        children = vnode.children;
      } else if (typeof vnode.children === 'function') {
        // Si c'est une fonction (slot), on l'appelle pour obtenir le contenu
        children = vnode.children();
      } else if (vnode.children) {
        // Sinon, encapsuler l'enfant unique dans un tableau
        children = [vnode.children];
      }

      // Créer le composant Tooltip
      const tooltipElement = h(
        Tooltip,
        {},
        {
          default: () =>
            createVNode(vnode.type, vnode.props, children), // Utiliser les enfants traités
          tooltip: () => binding.value, // Passer la valeur de la directive comme prop
        }
      );

      // Rendu du Tooltip dans le conteneur cloné
      render(tooltipElement, parent);
    },
  })
})