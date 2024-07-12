<template>
  <Transition
    name="notification"
    @leave="leave"
    @before-enter="beforeEnter"
    @enter="enter"
  >
    <div v-if="isVisible"
      :class="[
        'notification',
        { 'notification--color': color },
        { 'notification--border': border },
        { 'notification--icon': icon },
        { 'notification--onClick': !!onClick },
        { 'notification--onClickClose': !!onClickClose },
        { 'notification--flat': flat },
        { 'notification--sticky': sticky },
        { 'notification--square': square },
        { 'notification--width-all': width == '100%' },
        { 'notification--width-auto': width == 'auto' },
        { 'notification--loading': loading },
        { 'notification--notPadding': notPadding },
        `notification--${variant}`,
        classNotification
      ]"
      @click="handleNotificationClick"
    >
      <div v-if="!loading && icon" class="notification__icon" ><i :class="icon" /></div>
      <div v-if="!loading" class="notification__content">
        <header v-if="title" class="notification__content__header">
          <h4 v-html="title" />
        </header>
        <div v-if="text" class="notification__content__text">
          <p v-html="text" />
        </div>
        <slot />
      </div>
      <button v-if="buttonClose" class="notification__close" @click="handleClickClose">
        <i class="i-mynaui-x icon-close w-5 h-5 block" />
      </button>
      <div v-if="loading" class="notification__loading" />
      <div class="notification__progress" :style="{ width: `${progress}%` }" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps({
  value: Boolean,
  content: { type: [String, Object], default: null },
  title: String,
  text: String,
  color: String,
  variant: String,
  border: Boolean,
  icon: String,
  onClickClose: { type: Function, default: null },
  onClick: { type: Function, default: null },
  buttonClose: { type: Boolean, default: true },
  flat: { type: Boolean, default: true },
  onDestroy: { type: Function, default: null },
  sticky: Boolean,
  square: Boolean,
  width: String,
  loading: Boolean,
  progressAuto: { type: Boolean, default: true },
  duration: { type: Number, default: 4000 },
  notPadding: Boolean,
  clickClose: Boolean,
  classNotification: String
})

const isVisible = ref(false)
const progress = ref(1)
const intervalProgress = ref()

const close = () => {
  isVisible.value = false
}

const handleClickClose = () => {
  isVisible.value = false
}


const beforeEnter = (el:any) => {
  el.style.maxHeight = `0px`
  el.style.padding = `0px 20px`
}

const enter = (el:any, done:any) => {
  const h = el.scrollHeight
  el.style.maxHeight = `${h + 40}px`
  if (window.innerWidth < 600) {
    el.style.padding = `15px`
  } else {
    el.style.padding = `20px`
  }
  done()
}

const leave = (el: { parentNode: any; }, done: () => void) => {
  const parent = el.parentNode
  setTimeout(() => {
    done()
    /*if (parent.childNodes.length == 1) {
      document.body.removeChild(parent)
    }*/
    //parent.removeChild(el)
    if (props.onDestroy) {
      props.onDestroy()
    }
  }, 250)
}

watch(() => isVisible.value, (val) => {
  nextTick(() => {
    
  })
})

onMounted(() => {
  isVisible.value = true
  if (props.progressAuto) {
    intervalProgress.value = setInterval(() => {
      progress.value++
      if(progress.value > 100) {
        isVisible.value = false
        clearInterval(intervalProgress.value)
      }
    }, (props.duration / 100))
  }
})

onBeforeUnmount(() => {
  clearInterval(intervalProgress.value)
})

const handleNotificationClick = () => {
  if (props.onClick) {
    props.onClick()
  }
  if (props.clickClose) {
    close()
    if (props.onClickClose) {
      props.onClickClose()
    }
  }
}
</script>

<style>
.notification-enter-active,
.notification-leave-active {
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.notification-enter, .notification-leave-to {
  max-height: 0;
  padding: 0 20px;
  opacity: 0;
}

.notification-enter-to, .notification-leave {
  max-height: 100px; /* Ajustez cette valeur selon vos besoins */
  padding: 20px;
  opacity: 1;
}

.notification-enter-active {
    -webkit-transition: all .3s ease .05s,margin .25s ease,-webkit-transform .3s ease,-webkit-clip-path 8s ease .8s;
    transition: all .3s ease .05s,margin .25s ease,-webkit-transform .3s ease,-webkit-clip-path 8s ease .8s;
    transition: all .3s ease .05s,transform .3s ease,margin .25s ease,clip-path 8s ease .8s;
    transition: all .3s ease .05s,transform .3s ease,margin .25s ease,clip-path 8s ease .8s,-webkit-transform .3s ease,-webkit-clip-path 8s ease .8s
}

.notification-leave-to {
    max-height: 0!important;
    padding-top: 0!important;
    padding-bottom: 0!important;
    margin-top: 0!important;
    margin-bottom: 0!important;
    -webkit-box-shadow: 0 0 0 0 transparent;
    box-shadow: 0 0 0 0 transparent;
    opacity: 0!important
}

.notification-enter,.notification-leave-to {
    -webkit-clip-path: circle(0 at 80% 35%)!important;
    clip-path: circle(0 at 80% 35%)!important
}

.notification-enter {
    -webkit-transform: translate(25%);
    transform: translate(25%)
}

.notification-enter .notification__content {
  @apply opacity-0 translate-x-[10%];
}
.notification-parent {
  @apply fixed z-[200000] transition-all duration-[25s] ease-[ease] flex flex-col items-end justify-end px-0 py-2.5 right-0 bottom-0;
}
.notification-parent--top-center,
.notification-parent--top-right {
  @apply flex flex-col-reverse top-0 bottom-auto;
}
.notification-parent--top-center {
  @apply -translate-x-2/4 left-2/4 right-auto;
}
.notification-parent--top-center .notification--sticky {
  @apply mx-5 my-[3px] rounded-[20px] last:-mt-2.5 last:rounded-[0_0_20px_20px];
}
.notification-parent--top-center .notification {
  clip-path: circle(120% at 50% 0);

  transition: all 0.25s ease, transform 0.3s ease, max-height 0.25s ease,
    clip-path 0.5s ease 0.1s;
}
.notification-parent--top-center .notification.notification--border {
  @apply border-t-primary border-[3px] border-solid border-transparent;
}
.notification-parent--top-center .notification-enter {
  @apply -translate-y-1/4;
  clip-path: circle(0 at 50% 0) !important;
}
.notification-parent--top-center
  .notification-enter
  .notification__content {
  @apply opacity-0 translate-y-[-10%];
}
.notification-parent--bottom-center {
  @apply -translate-x-2/4 left-2/4 right-auto;
}
.notification-parent--bottom-center .notification--sticky {
  @apply mx-5 my-[3px] rounded-[20px] last:-mb-2.5 last:rounded-[20px_20px_0_0];
}
.notification-parent--bottom-center .notification {
  clip-path: circle(120% at 50% 100%);
  -webkit-transition: all 0.25s ease, max-height 0.25s ease,
    -webkit-transform 0.3s ease, -webkit-clip-path 0.5s ease 0.1s;
  transition: all 0.25s ease, max-height 0.25s ease, -webkit-transform 0.3s ease,
    -webkit-clip-path 0.5s ease 0.1s;
  transition: all 0.25s ease, transform 0.3s ease, max-height 0.25s ease,
    clip-path 0.5s ease 0.1s;
  transition: all 0.25s ease, transform 0.3s ease, max-height 0.25s ease,
    clip-path 0.5s ease 0.1s, -webkit-transform 0.3s ease,
    -webkit-clip-path 0.5s ease 0.1s;
}
.notification-parent--bottom-center
  .notification.notification--border {
  @apply border-b-primary border-[3px] border-solid border-transparent;
}
.notification-parent--bottom-center .notification-enter {
  @apply translate-y-1/4;
  clip-path: circle(0 at 50% 100%) !important;
}
.notification-parent--bottom-center
  .notification-enter
  .notification__content {
  @apply opacity-0 translate-y-[10%];
}
.notification-parent--top-left {
  @apply flex flex-col-reverse items-start justify-end left-0 right-auto top-0 bottom-auto;
}
.notification-parent--top-left .notification--sticky {
  @apply ml-0 rounded-[0_20px_20px_0];
}
.notification-parent--top-left .notification {
  clip-path: circle(145% at 0 50%);
}
.notification-parent--top-left .notification.notification--border {
  @apply border-l-primary border-[3px] border-solid border-transparent;
}
.notification-parent--top-left .notification-enter {
  @apply -translate-x-1/4;
  clip-path: circle(0 at 20% 35%) !important;
}
.notification-parent--top-left
  .notification-enter
  .notification__content {
  @apply opacity-0 translate-x-[-10%];
}
.notification-parent--bottom-left {
  @apply left-0 right-auto;
}
.notification-parent--bottom-left .notification--sticky {
  @apply ml-0 rounded-[0_20px_20px_0];
}
.notification-parent--bottom-left .notification {
  clip-path: circle(145% at 0 50%);
}
.notification-parent--bottom-left .notification.notification--border {
  @apply border-l-primary border-[3px] border-solid border-transparent;
}
.notification-parent--bottom-left .notification-enter {
  @apply -translate-x-1/4;
  clip-path: circle(0 at 20% 35%) !important;
}
.notification-parent--bottom-left
  .notification-enter
  .notification__content {
  @apply opacity-0 translate-x-[-10%];
}
.notification {
  transition: all .25s ease,transform .3s ease .1s,max-height .25s ease,clip-path .5s ease .1s;
  @apply bg-white relative max-w-[340px]  w-full h-auto shadow-[0_10px_30px_-5px] text-sm shadow-black/15 overflow-hidden  mx-2.5 my-[3px] rounded-[20px];
}
.notification:hover:not(.notification--flat) {
  @apply shadow-[0_0_0_0] shadow-black/05 translate-y-[3px];
}
.notification--notPadding {
  @apply p-0;
}
.notification.notification--icon {
  @apply !pl-[50px];
}
.notification.notification--loading {
  @apply w-[100px] max-h-[100px] min-h-[100px] flex items-center justify-center p-0;
}
.notification--width-auto {
  @apply w-auto max-w-none;
}
.notification--width-all {
  @apply max-w-[calc(100vw_-_50px)] w-[calc(100vw_-_50px)];
}
.notification--square {
  @apply rounded-none ;
}
.notification--sticky {
  @apply mr-0 mb-0 rounded-[20px_0_0_20px];
}
.notification--flat {
  @apply bg-white  after:content-[""] after:w-full after:h-full after:absolute after:z-[-1] after:transition-all after:duration-[0.25s] after:ease-[ease] after:rounded-[inherit] after:left-0 after:top-0;
}
.notification--flat:hover:after {
  background: rgba(var(--color), 0.15);
}
.notification--flat .notification__progress {
  @apply bg-primary
}
.notification--flat .notification__close {
  --color: inherit;
}
.notification--flat.notification--border {
  @apply border-r-primary border-r-[3px] border-0 border-solid border-transparent;
}

.notification.notification--onClick {
  @apply cursor-pointer;
}
.notification.notification--color:not(.notification--flat) {
  @apply text-white;
}
.notification.notification--color:not(.notification--flat)
  .notification__progress {
    @apply bg-white;
}
.notification.notification--color:not(.notification--flat)
  .notification__close {
  --color: 255, 255, 255;
}
.notification.notification--color:not(.notification--flat)
  .notification__loading:after {
  @apply border-b-white border-2 border-solid border-transparent;
}
.notification.notification--color:not(.notification--flat)
  .notification__loading:before {
  @apply border-b-white border-2 border-solid border-transparent border-dashed;
}
.notification.notification--border {
  @apply border-r-primary border-[3px] border-solid border-transparent ;
}
.notification__progress {
  @apply bg-primary w-0 h-0.5 absolute transition-all duration-[0.25s] ease-[ease] left-0 bottom-0;
}
.notification__loading {
  @apply w-[50px] h-[50px] absolute rounded-[50%] after:border-[rgba(var(--text),1)] after:animate-[loadingNoti_0.8s_ease_infinite] after:rounded-[inherit] after:border-t-transparent after:border-x-transparent after:border-2 after:border-solid before:border-[rgba(var(--text),1)] before:animate-[loadingNoti_0.8s_linear_infinite] before:opacity-20 before:rounded-[inherit] before:border-t-transparent before:border-x-transparent before:border-2 before:border-dashed before:border-solid;
}
.notification__loading:after {
  animation: loadingNoti 0.8s ease infinite;
}
.notification__loading:after,
.notification__loading:before {
  @apply box-border absolute w-full h-full content-[""] top-0;
}
.notification__loading:before {
  animation: loadingNoti 0.8s linear infinite;
}
.notification__close {
  @apply absolute p-0 border-0 scale-75 right-1 top-1 bg-transparent;
}
.notification__icon {
  @apply bg-transparent absolute top-[calc(50%_-_22px)] w-[45px] h-[45px] flex items-center justify-center rounded-[0_35%_35%_0] left-0.5;
}
.notification__icon i {
  @apply text-[1.2rem] bg-primary;
}

.notification--error .notification__icon i {
  @apply !bg-error;
}
.notification--error .notification__progress {
  @apply !bg-error;
}

.notification--error .notification__content__header h4 {
  @apply text-error;
}

.notification-parent--bottom-left .notification--error.notification--border, .notification-parent--top-left .notification--error.notification--border {
  @apply !border-l-error;
}

.notification-parent--bottom-right .notification--error.notification--border, .notification-parent--top-right .notification--error.notification--border {
  @apply !border-r-error;
}

.notification-parent--top-center .notification--error.notification.notification--border {
  @apply !border-t-error;
}

.notification-parent--bottom-center .notification--error.notification.notification--border {
  @apply !border-b-error;
}

.notification--warning .notification__icon i {
  @apply !bg-warning;
}
.notification--warning .notification__progress {
  @apply !bg-warning;
}

.notification--warning .notification__content__header h4 {
  @apply text-warning;
}

.notification-parent--bottom-left .notification--warning.notification--border, .notification-parent--top-left .notification--warning.notification--border {
  @apply !border-l-warning;
}

.notification-parent--bottom-right .notification--warning.notification--border, .notification-parent--top-right .notification--warning.notification--border {
  @apply !border-r-warning;
}

.notification-parent--top-center .notification--warning.notification.notification--border {
  @apply !border-t-warning;
}

.notification-parent--bottom-center .notification--warning.notification.notification--border {
  @apply !border-b-warning;
}

.notification--success .notification__icon i {
  @apply !bg-success;
}
.notification--success .notification__progress {
  @apply !bg-success;
}

.notification--success .notification__content__header h4 {
  @apply text-success;
}

.notification-parent--bottom-left .notification--success.notification--border, .notification-parent--top-left .notification--success.notification--border {
  @apply !border-l-success;
}

.notification-parent--bottom-right .notification--success.notification--border, .notification-parent--top-right .notification--success.notification--border {
  @apply !border-r-success;
}

.notification-parent--top-center .notification--success.notification.notification--border {
  @apply !border-t-success;
}

.notification-parent--bottom-center .notification--success.notification.notification--border {
  @apply !border-b-success;
}


.notification__content {
  @apply relative w-auto h-auto transition-all duration-[0.25s] ease-[ease] delay-[0.2s] opacity-100;
}
.notification__content__text {
  @apply w-full text-on-surface;
}
.notification__content__text p {
  @apply text-xs leading-4 m-0 p-0;
}
.notification__content__header {
  @apply w-full m-0 pt-0 pb-1.5 px-0;
}
.notification__content__header h4 {
  @apply w-full text-[0.9rem] m-0 p-0 font-semibold text-primary;
}
.dark .notification--dark {
  @apply text-white;
}
.dark .notification--dark .notification__close {
  --color: 255, 255, 255 !important;
}
.dark .notification--dark h4,
.dark .notification--dark p {
  @apply text-white;
}
@media (max-width: 600px) {
  .notification {
    @apply w-full max-w-full min-w-full mx-0 my-[3px] rounded-none hover:translate-x-0 last:mb-0;
  }
  .notification-parent {
    @apply w-full max-w-full p-0;
  }
  .notification-parent .notification--sticky {
    @apply mb-0;
  }
  .notification-parent.notification-parent--top-center
    .notification:last-child {
    @apply mt-0 mb-[3px];
  }
}

@keyframes loadingNoti {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg)
    }

    to {
        -webkit-transform: rotate(1turn);
        transform: rotate(1turn)
    }
}

@keyframes progressNoti {
    0% {
        width: 0
    }

    to {
        width: 100%
    }
}
</style>