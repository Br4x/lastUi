import { defineNuxtPlugin } from '#app'
import { createVNode, render } from 'vue'
import Modal from '@/components/Modal.vue'
import Prompt from '@/components/Prompt.vue'

interface DialogParams {
  title?:String,
  body?: String,
  buttons?: Object,
  resizable?:Boolean,
  position?:String
}

interface PromptDefault {
  default?:String,
  min?: number,
  max?: number,
  step?:number,
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
      },
      prompt: (body:string, defaultValue:PromptDefault, callback: Function ) => {
        let parent = document.getElementById(`dialog-parent--bottom-right`)
        if(!parent) {
          parent = document.createElement('div')
          parent.id = `dialog-parent--bottom-right`
          document.body.appendChild(parent)
        }

        parent.className = 'dialog-parent'
        parent.classList.add(`dialog-parent--bottom-right`)
        const wrapper = document.createElement('div')

        const count = parseInt(parent.getAttribute('count')|| '0') 
        parent.setAttribute('count', (count+1).toString())
        parent.appendChild(wrapper)

        const modelValue = ref(true)
        const vnode = createVNode(Prompt, {
          body,
          default: defaultValue.default,
          min: defaultValue.min,
          step: defaultValue.step,
          max: defaultValue.max,
          modelValue: modelValue,
          callback:callback,
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
