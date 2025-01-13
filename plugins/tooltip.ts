import Tooltip from '~/components/Tooltip.vue'
import { h, render, createVNode } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tip', {
    mounted(el, binding, vnode) {
      if (!binding.value) return; // Ne rien faire si aucune valeur n'est passée

      // Cloner l'élément pour conserver ses styles et attributs
      const parent = el.cloneNode(false); // Ne pas cloner les enfants
      el.replaceWith(parent);

      // Détecter les enfants dans vnode
      let children;
      if (Array.isArray(vnode.children)) {
        // Cas où les enfants sont déjà un tableau
        children = vnode.children;
      } else if (typeof vnode.children === 'function') {
        // Cas où les enfants sont une fonction (slot dynamique)
        children = vnode.children();
      } else if (typeof vnode.children === 'string' || typeof vnode.children === 'object') {
        // Cas où les enfants sont une chaîne ou un objet unique
        children = [vnode.children];
      } else {
        // Aucun enfant ou format inattendu
        children = [];
      }

      // Créer le composant Tooltip
      const tooltipElement = h(
        Tooltip,
        {},
        {
          default: () =>
            createVNode(vnode.type, vnode.props || {}, children), // Utiliser les enfants traités
          tooltip: () => binding.value, // Passer la valeur de la directive comme prop
        }
      );

      // Rendu du Tooltip dans le conteneur cloné
      render(tooltipElement, parent);
    },
  });
});
