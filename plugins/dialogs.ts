import { defineNuxtPlugin } from '#app'
import { createVNode, render } from 'vue'
import Modal from '@/components/Modal.vue'

interface DialogParams {
  title?:String,
  body?: String,
  buttons?: Object,
  resizable?:Boolean,
  position?:String
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dialog: (params: DialogParams = {}) => {
        let parent = document.getElementById(`dialog-parent--${params.position || 'bottom-right'}`)
        if(!parent) {
          parent = document.createElement('div')
          parent.id = `dialog-parent--${params.position || 'bottom-right'}`
          document.body.appendChild(parent)
        }

        parent.className = 'dialog-parent'
        parent.classList.add(`dialog-parent--${params.position || 'bottom-right'}`)
        const wrapper = document.createElement('div')

        const count = parseInt(parent.getAttribute('count')|| '0') 
        parent.setAttribute('count', (count+1).toString())
        parent.appendChild(wrapper)

        const modelValue = ref(true)
        const vnode = createVNode(Modal, {
          ...params,
          modelValue: modelValue,
          onClose: () => {
            const count = parseInt(parent.getAttribute('count')|| '0') 
            parent.setAttribute('count', (count - 1).toString())
            render(null, wrapper)
            parent.removeChild(wrapper)
            if(count - 1 <= 0)
              document.body.removeChild(parent)
          }
        })

        render(vnode, wrapper)

      }
    }
  }
})
