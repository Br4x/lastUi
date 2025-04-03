<script setup lang="ts">
import { useDraggable } from '@vueuse/core'

const props = defineProps({
  title: String,
  modelValue: Boolean,
  loading: Boolean,
  fullScreen: Boolean,
  notClose: Boolean,
  preventClose: Boolean,
  notPadding: Boolean,
  overflowHidden: Boolean,
  blur: Boolean,
  square: Boolean,
  autoWidth: Boolean,
  scroll: Boolean,
  notCenter: Boolean,
  width: String,
  routerClose: Boolean,
  buttons: Object,
  contentClass: String
})

const emit = defineEmits(['update:model-value', 'close', 'confirm'])

const rebound = ref(false)
const dialogContent = ref<HTMLElement | null>()
const dialogEl = ref<HTMLElement | null>()
const isMinimized = ref(false)
const originalHeight = ref('')
const originalContentHeight = ref('')

// Pour le draggable
const dragHandleRef = ref<HTMLElement | null>(null)

const isDragging = ref(false)
const dragData = ref<{ x: number; y: number }>({ x: 0, y: 0 })

watchEffect(() => {
  if (dialogEl.value && dragHandleRef.value) {
    const { x, y, style, isDragging: dragging } = useDraggable(dialogEl, {
      handle: dragHandleRef,
      initialValue: dragData.value
    })

    watch([x, y], () => {
      dragData.value = { x: x.value, y: y.value }
    })

    watch(dragging, (newVal) => {
      isDragging.value = newVal
    })
  }
})


const toggleMinimize = () => {
  if (!isMinimized.value) {
    if (dialogEl.value) {
      originalHeight.value = dialogEl.value.style.height || 'auto'

      const content = dialogEl.value.querySelector('.dialog__content')
      if (content) {
        originalContentHeight.value = (content as HTMLElement).style.height || 'auto'
      }

      // Trouver toutes les autres modals déjà minimisées
      const minimizedModals = document.querySelectorAll('.dialog--minimized')

      // Déterminer la position en fonction du nombre de modals déjà minimisées
      const spacing = 10
      const bottomOffset = 10 + minimizedModals.length * 50 // Décalage vertical

      dialogEl.value.style.position = 'fixed'
      dialogEl.value.style.bottom = `${bottomOffset}px`
      dialogEl.value.style.right = '10px'
      dialogEl.value.style.left = 'auto'
      dialogEl.value.style.top = 'auto'
      dialogEl.value.style.width = '250px'
      dialogEl.value.style.height = '40px'

      isMinimized.value = true
    }
  } else {
    isMinimized.value = false

    nextTick(() => {
      if (dialogEl.value) {
        dialogEl.value.style.position = ''
        dialogEl.value.style.bottom = ''
        dialogEl.value.style.right = ''
        dialogEl.value.style.width = ''
        dialogEl.value.style.height = originalHeight.value

        const content = dialogEl.value.querySelector('.dialog__content')
        if (content) {
          (content as HTMLElement).style.height = originalContentHeight.value
        }
      }
    })
  }
}


const esc = (evt: KeyboardEvent) => {
  if (evt.key === 'Escape' && !props.preventClose) {
    emit('update:model-value', false)
    emit('close')
  }
}

const addEsc = () => {
  window.addEventListener('keydown', esc)
}

const insertDialog = () => {
  addEsc()
  nextTick(() => {
    if (dialogContent.value) {
      const target = document.querySelector('#__nuxt') ? document.querySelector('#__nuxt') : document.body
      target?.insertBefore(dialogContent.value, target.lastChild)
    }
  })
}

watch(() => props.modelValue, (val: boolean) => {
  if (val) {
    insertDialog()
    if (props.overflowHidden) {
      document.body.style.overflow = 'hidden'
    }
  } else {
    if (props.overflowHidden) {
      document.body.style.overflow = ''
    }
    window.removeEventListener('keydown', esc)
  }
})

onBeforeUnmount(() => {
  if (dialogContent.value && dialogContent.value.parentNode) {
    dialogContent.value.parentNode.removeChild(dialogContent.value)
  }
})
</script>

<template>
  <Transition name="dialog">
    <div v-if="props.modelValue" ref="dialogContent"
      :class="['dialog-content', { blur: props.blur, fullScreen: props.fullScreen }]">
      <div ref="dialogEl" :class="['dialog', {
        'dialog--fullScreen': props.fullScreen,
        'dialog--rebound': rebound,
        'dialog--notPadding': props.notPadding,
        'dialog--square': props.square,
        'dialog--autoWidth': props.autoWidth,
        'dialog--scroll': props.scroll,
        'dialog--loading': props.loading,
        'dialog--notCenter': props.notCenter,
        'dialog--minimized': isMinimized,
        'is-dragging': isDragging
      }]" >
        <div v-if="props.loading && !isMinimized" class="dialog__loading">
          <div class="dialog__loading__load" />
        </div>
        <header v-if="$slots.header || title" class="dialog__header" ref="dragHandleRef">
          <div class="header-drag-area">
            <slot name="header">
              <h4 class="font-semibold">{{ title }}</h4>
            </slot>
          </div>
          <div class="dialog-controls">
            <button class="dialog-control minimize-btn" @click.stop="toggleMinimize">
              <i :class="isMinimized ?'i-ic-baseline-plus':'i-ic-baseline-remove'" />
            </button>
            <button v-if="!props.notClose" class="dialog-control close-btn"
              @click.stop="emit('update:model-value', false); emit('close')">
              <i class="i-ic-baseline-close" />
            </button>
          </div>
        </header>
        <div v-show="!isMinimized" class="dialog__content" :class="[{ notFooter: !$slots.footer }, contentClass]">
          <slot />
        </div>
        <footer v-if="$slots.footer && !isMinimized" class="dialog__footer">
          <div v-if="buttons" v-for="(launch, button) in buttons" class="flex gap-2">
            <Button :label="button" @click="launch" />
          </div>

          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.dialog-enter-active {
  @apply transition-all duration-[0.25s] ease-[ease];
}

.dialog-enter-active .dialog:not(.dialog--fullScreen) {
  @apply animate-[rebound_0.4s];
  animation: rebound .4s;
}

.dialog-leave-active,
.dialog-leave-active .dialog {
  @apply transition-all duration-[0.15s] ease-[ease];
}

.dialog-enter,
.dialog-leave-to {
  @apply opacity-0;
}

.dialog-enter .dialog,
.dialog-leave-to .dialog {
  @apply shadow-[0_0_0_0] scale-[0.7];
}

.dialog-enter .dialog--fullScreen,
.dialog-leave-to .dialog--fullScreen {
  @apply !translate-y-[8%];
}

.dialog-content {
  @apply fixed z-99000 flex items-start justify-center w-full h-full max-h-screen overflow-y-auto overflow-x-hidden py-20 left-0 top-0;
  pointer-events: none;
  /* Permet les clics à travers le fond */
}

.dialog {
  @apply !bg-white shadow-lg text-[rgba(var(--text), 1)] relative min-w-[400px] rounded-[20px] transition-all duration-[0.25s] ease-[ease] shadow-[0_5px_30px_0_rgba(0, 0, 0, var(--shadow-opacity))] m-auto;
  position: relative;
  pointer-events: auto;
  /* Restaure les interactions pour la boîte de dialogue */
}

/* Style pour la dialogue draggable */
.dialog.is-dragging {
  @apply cursor-grabbing;
  transition: none;
  user-select: none;
}

/* Dialog minimisé */


.dialog--minimized .dialog__header {
  @apply mb-0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.dialog--minimized {
  @apply min-h-10 min-w-[250px] max-w-[250px] max-h-10 overflow-hidden flex items-center justify-between;
}
.dialog--minimized .dialog__content,
.dialog--minimized .dialog__footer {
  @apply hidden;
}

.dialog--notCenter .dialog__header {
  @apply block;
}

.dialog__loading {
  @apply bg-white bg-opacity-80 w-full absolute h-[calc(100%-48px)] mt-[48px] z-[100] flex items-center justify-center rounded-[inherit] left-0 top-0;
}

.dialog__loading:after {
  border-radius: inherit;
  border-left: 2px solid rgb(59 130 246 / var(--un-bg-opacity));
  border-bottom: 2px solid rgb(59 130 246 / var(--un-bg-opacity));
  border-top: 2px solid rgb(59 130 246 / var(--un-bg-opacity));
  border: 2px solid rgb(59 130 246 / 0);
  border-right-color: rgb(59 130 246 / var(--un-bg-opacity));
  -webkit-animation: loadingDialog .6s ease infinite;
  animation: loadingDialog .6s ease infinite;
}

.dialog__loading:after,
.dialog__loading:before {
  @apply content-[""] absolute w-[30px] h-[30px] box-border transition-all duration-[0.25s] ease-[ease] block shadow-[0_0_0_0];
}

.dialog__loading:before {
  border-radius: inherit;
  border-left: 2px dashed rgb(59 130 246 / var(--un-bg-opacity));
  border-bottom: 2px dashed rgb(59 130 246 / var(--un-bg-opacity));
  border-top: 2px dashed rgb(59 130 246 / var(--un-bg-opacity));
  border: 2px solid rgb(59 130 246 / 0);
  border-right: 2px dashed rgb(59 130 246 / var(--un-bg-opacity));
  -webkit-animation: loadingDialog .6s linear infinite;
  animation: loadingDialog .6s linear infinite;
}

.dialog--scroll .dialog__content {
  @apply max-h-[calc(80vh_-_200px)] overflow-auto;
}

.dialog--autoWidth {
  @apply w-auto min-w-[auto] max-w-[auto];
}

.dialog--square,
.dialog--square .dialog-controls button {
  @apply rounded-none;
}

.dialog--notPadding .dialog__footer {
  @apply p-0;
}

.dialog--notPadding .dialog__content {
  @apply mb-0 p-0;
}

.dialog--notPadding .dialog__header {
  @apply p-0;
}

.dialog--rebound {
  @apply animate-[reboundClick_0.3s];
  animation: reboundClick 0.3s !important;
}

.dialog--fullScreen {
  @apply w-[calc(100%_-_30px)] h-[calc(100%_-_30px)] max-w-none max-h-[none];
}

.dialog__footer {
  @apply pt-0 pb-2.5 px-4;
}

.dialog__header {
  @apply flex items-center justify-between px-4 py-2.5 cursor-move;
  -webkit-box-align: center;
  -ms-flex-align: center;
}

.header-drag-area {
  @apply flex-grow;
}

.dialog-controls {
  @apply flex items-center gap-1;
}

.dialog-control {
  @apply w-[28px] h-[28px] flex items-center justify-center rounded-lg transition-all duration-200 m-0 p-0 border-0 hover:bg-gray-100;
  background: inherit;
}

.dialog-control i {
  @apply opacity-70;
}

.dialog-control:hover i {
  @apply opacity-100;
}

.dialog__content {
  @apply w-full relative px-4 py-2.5 rounded-[inherit];
}

.dialog__content.notFooter {
  @apply mb-5;
}

@keyframes loadingDialog {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0)
  }

  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn)
  }
}


@keyframes rebound {
  0% {
    -webkit-transform: scale(.8);
    transform: scale(.8)
  }

  40% {
    -webkit-transform: scale(1.08);
    transform: scale(1.08)
  }

  80% {
    -webkit-transform: scale(.98);
    transform: scale(.98)
  }

  to {
    -webkit-transform: scale(1);
    transform: scale(1)
  }
}

@keyframes reboundClick {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1)
  }

  40% {
    -webkit-transform: scale(1.05);
    transform: scale(1.05)
  }

  80% {
    -webkit-transform: scale(.96);
    transform: scale(.96)
  }

  to {
    -webkit-transform: scale(1);
    transform: scale(1)
  }
}

@media (max-width: 600px) {
  .dialog {
    min-width: calc(100vw - 20px);
    max-width: calc(100vw - 20px);
    margin: auto 10px
  }
}
</style>