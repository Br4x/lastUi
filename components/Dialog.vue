<script setup lang="ts">
const props = defineProps({
  modelValue: { default: false, type: Boolean },
  loading: { default: false, type: Boolean },
  fullScreen: { default: false, type: Boolean },
  notClose: { default: false, type: Boolean },
  preventClose: { default: false, type: Boolean },
  notPadding: { default: false, type: Boolean },
  overflowHidden: { default: false, type: Boolean },
  blur: { default: false, type: Boolean },
  square: { default: false, type: Boolean },
  autoWidth: { default: false, type: Boolean },
  scroll: { default: false, type: Boolean },
  notCenter: { default: false, type: Boolean },
  width: { default: null, type: String },
  routerClose: { default: false, type: Boolean }
})

const emits = defineEmits(['update:model-value', 'close'])

const rebound = ref(false)
const dialogContent = ref<HTMLElement | null>(null)

const esc = (evt: KeyboardEvent) => {
  if (evt.key === 'Escape' && !props.preventClose) {
    emits('update:model-value', false)
    emits('close')
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

function closeDialog(evt:any) {
  if (!evt.target.closest('.vs-dialog') && !props.preventClose) {
    emits('update:model-value', false)
    emits('close')
  }
  if (props.preventClose && !evt.target.closest('.vs-dialog')) {
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
      :class="['vs-dialog-content', { blur: props.blur, fullScreen: props.fullScreen }]" @click="closeDialog">
      <div :class="['vs-dialog', {
      'vs-dialog--fullScreen': props.fullScreen,
      'vs-dialog--rebound': rebound,
      'vs-dialog--notPadding': props.notPadding,
      'vs-dialog--square': props.square,
      'vs-dialog--autoWidth': props.autoWidth,
      'vs-dialog--scroll': props.scroll,
      'vs-dialog--loading': props.loading,
      'vs-dialog--notCenter': props.notCenter,
    }]" :style="{ width: props.width }">
        <div v-if="props.loading" class="vs-dialog__loading">
          <div class="vs-dialog__loading__load"></div>
        </div>
        <button v-if="!props.notClose" class="vs-dialog__close" @click="emits('update:model-value', false)">
          <i class="i-ic-baseline-close" :hover="'x'" />
        </button>
        <header v-if="$slots.header" class="vs-dialog__header">
          <slot name="header" />
        </header>
        <div class="vs-dialog__content" :class="{ notFooter: !$slots.footer }">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="vs-dialog__footer">
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

.dialog-enter-active .vs-dialog:not(.dialog--fullScreen) {
  @apply animate-[rebound_0.4s];
  animation: rebound .4s;
}

.dialog-leave-active,
.dialog-leave-active .vs-dialog {
  @apply transition-all duration-[0.15s] ease-[ease];
}

.dialog-enter,
.dialog-leave-to {
  @apply opacity-0;
}

.dialog-enter .vs-dialog,
.dialog-leave-to .vs-dialog {
  @apply shadow-[0_0_0_0] scale-[0.7];
}

.dialog-enter .vs-dialog--fullScreen,
.dialog-leave-to .vs-dialog--fullScreen {
  @apply !translate-y-[8%];
}

.vs-dialog-content {
  @apply bg-black bg-opacity-20 fixed z-99000 flex items-start justify-center w-full h-full max-h-screen overflow-y-auto overflow-x-hidden py-20 left-0 top-0;
}

.vs-dialog-content.fullScreen {
  @apply overflow-hidden p-0;
}

.vs-dialog-content.blur {
  @apply backdrop-saturate-[180%] backdrop-blur-[15px];
}

.vs-dialog {
  @apply !bg-white text-[rgba(var(--vs-text), 1)] relative min-w-[400px] rounded-[20px] transition-all duration-[0.25s] ease-[ease] shadow-[0_5px_30px_0_rgba(0, 0, 0, var(--vs-shadow-opacity))] max-w-[800px] m-auto;
}

.vs-dialog--notCenter .vs-dialog__header {
  @apply block;
}

.vs-dialog__loading {
  @apply bg-white bg-opacity-80 w-full absolute h-full z-[100] flex items-center justify-center rounded-[inherit] left-0 top-0 ;
}

.vs-dialog__loading:after {
    border-radius: inherit;
    border-left: 2px solid rgb(59 130 246 / var(--un-bg-opacity));
    border-bottom: 2px solid rgb(59 130 246 / var(--un-bg-opacity));
    border-top: 2px solid rgb(59 130 246 / var(--un-bg-opacity));
    border: 2px solid  rgb(59 130 246 / 0);
    border-right-color: rgb(59 130 246 / var(--un-bg-opacity));
    -webkit-animation: loadingDialog .6s ease infinite;
    animation: loadingDialog .6s ease infinite;
}

.vs-dialog__loading:after,
.vs-dialog__loading:before {
  @apply content-[""] absolute w-[30px] h-[30px] box-border transition-all duration-[0.25s] ease-[ease] block shadow-[0_0_0_0];
}

.vs-dialog__loading:before {
  border-radius: inherit;
    border-left: 2px dashed rgb(59 130 246 / var(--un-bg-opacity));
    border-bottom: 2px dashed rgb(59 130 246 / var(--un-bg-opacity));
    border-top: 2px dashed rgb(59 130 246 / var(--un-bg-opacity));
    border: 2px solid  rgb(59 130 246 / 0);
    border-right: 2px dashed rgb(59 130 246 / var(--un-bg-opacity));
    -webkit-animation: loadingDialog .6s linear infinite;
    animation: loadingDialog .6s linear infinite;
}

.vs-dialog--scroll .vs-dialog__content {
  @apply max-h-[calc(80vh_-_200px)] overflow-auto;
}

.vs-dialog--autoWidth {
  @apply w-auto min-w-[auto] max-w-[auto];
}

.vs-dialog--square,
.vs-dialog--square .vs-dialog__close {
  @apply rounded-none;
}

.vs-dialog--notPadding .vs-dialog__footer {
  @apply p-0;
}

.vs-dialog--notPadding .vs-dialog__content {
  @apply mb-0 p-0;
}

.vs-dialog--notPadding .vs-dialog__header {
  @apply p-0;
}

.vs-dialog--rebound {
  @apply animate-[reboundClick_0.3s];
  animation: reboundClick 0.3s !important;
}

.vs-dialog--fullScreen {
  @apply w-[calc(100%_-_30px)] h-[calc(100%_-_30px)] max-w-none max-h-[none];
}

.vs-dialog__footer {
  @apply pt-0 pb-2.5 px-4;
}

.vs-dialog__header {
  @apply flex items-center justify-center px-4 py-2.5;
  display: -webkit-box;
  display: -ms-flexbox;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
}

.vs-dialog__content {
  @apply w-full relative px-4 py-2.5 rounded-[inherit];
}

.vs-dialog__content.notFooter {
  @apply mb-5;
}

.vs-dialog__close {
  @apply absolute w-[34px] h-[34px] flex items-center justify-center shadow-[0_5px_20px_0] shadow-black/10 transition-all duration-[0.25s] ease-[ease] z-[200] m-0 p-0 rounded-xl border-0 -right-1.5 -top-1.5 hover:shadow-[0_0_4px_0] hover:-translate-x-0.5 hover:translate-y-0.5;

  background: inherit;
}

.vs-dialog__close i {
  @apply opacity-70;
}

.vs-dialog__close i:after,
.vs-dialog__close i:before {
  @apply w-3.5;
}

.vs-dialog__close:hover {
  -webkit-box-shadow: 0 0 4px 0 rgba(0, 0, 0, var(--vs-shadow-opacity));
  -webkit-transform: translate(-2px, 2px);
}

.vs-dialog__close:hover i {
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
  .vs-dialog {
    min-width: calc(100vw - 20px);
    max-width: calc(100vw - 20px);
    margin: auto 10px
  }
}
</style>
