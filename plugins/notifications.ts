import { defineNuxtPlugin } from '#app'
import { createVNode, render } from 'vue'
import Notification from '@/components/Notification.vue'

interface NotificationParams {
  title?: string
  text?: string
  position?: string
  color?: string
  border?: boolean
  icon?: string
  duration?: number | string
  onClick?: any
  onClickClose?: any
  buttonClose?: boolean
  flat?: boolean
  onDestroy?: any
  sticky?: boolean
  square?: boolean
  width?: string
  loading?: boolean
  variant?: string
  progress?: any
  notPadding?: any
  content?: any
  clickClose?: boolean
  classNotification?: string
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      notification: (params: NotificationParams = {}) => {
        let parent = document.getElementById(`notification-parent--${params.position || 'bottom-right'}`)
        if(!parent) {
          parent = document.createElement('div')
          parent.id = `notification-parent--${params.position || 'bottom-right'}`
          document.body.appendChild(parent)
        }

        parent.className = 'notification-parent'
        parent.classList.add(`notification-parent--${params.position || 'bottom-right'}`)
        const wrapper = document.createElement('div')

        const count = parseInt(parent.getAttribute('count')|| '0') 
        parent.setAttribute('count', (count+1).toString())
        parent.appendChild(wrapper)

        const vnode = createVNode(Notification, {
          ...params,
          onDestroy: () => {
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
