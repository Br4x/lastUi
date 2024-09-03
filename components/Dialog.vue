<script setup lang="ts">
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
  routerClose: Boolean
})

const emit = defineEmits(['update:model-value', 'close'])

const rebound = ref(false)
const dialogContent = ref<HTMLElement | null>(null)

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

function closeDialog(evt: any) {
  if (!evt.target.closest('.dialog') && !props.preventClose) {
    emit('update:model-value', false)
    emit('close')
  }
  if (props.preventClose && !evt.target.closest('.dialog')) {
    rebound.value = true
    setTimeout(() => {
      rebound.value = false
    }, 300)
  }
}
</script>

<template>
  <Transition name="dialog">
    <div v-if="props.modelValue" ref="dialogContent"
      :class="['dialog-content', { blur: props.blur, fullScreen: props.fullScreen }]" @click="closeDialog">
      <div :class="['dialog', {
      'dialog--fullScreen': props.fullScreen,
      'dialog--rebound': rebound,
      'dialog--notPadding': props.notPadding,
      'dialog--square': props.square,
      'dialog--autoWidth': props.autoWidth,
      'dialog--scroll': props.scroll,
      'dialog--loading': props.loading,
      'dialog--notCenter': props.notCenter,
    }]" :style="{ width: props.width }">
        <div v-if="props.loading" class="dialog__loading">
          <div class="dialog__loading__load" />
        </div>
        <button v-if="!props.notClose" class="dialog__close" @click="emit('update:model-value', false);emit('close')">
          <i class="i-ic-baseline-close" :hover="'x'" />
        </button>
        <header v-if="$slots.header || title" class="dialog__header">
          <slot name="header">
            <h4 class="font-semibold">{{ title }}</h4>
          </slot>
        </header>
        <div class="dialog__content" :class="{ notFooter: !$slots.footer }">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="dialog__footer">
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
  @apply bg-black bg-opacity-20 fixed z-99000 flex items-start justify-center w-full h-full max-h-screen overflow-y-auto overflow-x-hidden py-20 left-0 top-0;
}

.dialog-content.fullScreen {
  @apply overflow-hidden p-0;
}

.dialog-content.blur {
  @apply backdrop-saturate-[180%] backdrop-blur-[15px];
}

.dialog {
  @apply !bg-white text-[rgba(var(--text), 1)] relative min-w-[400px] rounded-[20px] transition-all duration-[0.25s] ease-[ease] shadow-[0_5px_30px_0_rgba(0, 0, 0, var(--shadow-opacity))] max-w-[800px] m-auto;
}

.dialog--notCenter .dialog__header {
  @apply block;
}

.dialog__loading {
  @apply bg-white bg-opacity-80 w-full absolute h-full z-[100] flex items-center justify-center rounded-[inherit] left-0 top-0;
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
.dialog--square .dialog__close {
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
  @apply flex items-center justify-center px-4 py-2.5;
  display: -webkit-box;
  display: -ms-flexbox;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
}

.dialog__content {
  @apply w-full relative px-4 py-2.5 rounded-[inherit];
}

.dialog__content.notFooter {
  @apply mb-5;
}

.dialog__close {
  @apply absolute w-[34px] h-[34px] flex items-center justify-center shadow-[0_5px_20px_0] shadow-black/10 transition-all duration-[0.25s] ease-[ease] z-[200] m-0 p-0 rounded-xl border-0 -right-1.5 -top-1.5 hover:shadow-[0_0_4px_0] hover:-translate-x-0.5 hover:translate-y-0.5;

  background: inherit;
}

.dialog__close i {
  @apply opacity-70;
}

.dialog__close i:after,
.dialog__close i:before {
  @apply w-3.5;
}

.dialog__close:hover {
  -webkit-box-shadow: 0 0 4px 0 rgba(0, 0, 0, var(--shadow-opacity));
  -webkit-transform: translate(-2px, 2px);
}

.dialog__close:hover i {
  @apply opacity-100;
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
