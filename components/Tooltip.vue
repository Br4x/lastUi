<template>
  <div
    class="tooltip-content"
    ref="contentRef"
    @mouseenter="!notHover && handlerMouseEnter()"
    @mouseleave="!notHover && handleMouseLeave()"
  >
    <Transition name="tooltip">
      <div
        v-if="activeTooltip"
        class="tooltip component--primary"
        ref="tooltipRef"
        :class="[
          { top: !bottom && !left && !right },
          { bottom: bottom },
          { left: left },
          { right: right },
          { shadow: shadow },
          { notArrow: notArrow },
          { square: square },
          { circle: circle },
          { border: border },
          { borderThick: borderThick },
          { loading: loading }, 
          position
        ]"
        @mouseenter="interactivity && handleMouseEnterTooltip()"
        @mouseleave="interactivity && handleMouseLeaveTooltip()"
      >
        <slot name="tooltip" />
        <div v-if="loading" class="tooltip__loading" />
      </div>
    </Transition>
    <slot />
  </div>
</template>

<script setup>

const props = defineProps({
  modelValue: null,
  loading: { type: Boolean, default: false },
  bottom: { type: Boolean, default: false },
  left: { type: Boolean, default: false },
  right: { type: Boolean, default: false },
  notHover: { type: Boolean, default: false },
  shadow: { type: Boolean, default: false },
  interactivity: { type: Boolean, default: false },
  notArrow: { type: Boolean, default: false },
  square: { type: Boolean, default: false },
  circle: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  borderThick: { type: Boolean, default: false },
  delay: { type: Number, default: 0 },
  color: { type: String, default: null },
  primary: { type: Boolean, default: false },
  danger: { type: Boolean, default: false },
  warn: { type: Boolean, default: false },
  success: { type: Boolean, default: false },
  dark: { type: Boolean, default: false },
  position:{ type: String, default: 'top' } 
})

const activeTooltip = ref(props.modelValue)
const isHoverTooltip = ref(false)
const tooltipRef = ref()
const contentRef = ref()

const insertTooltip = () => {
  insertBody(tooltipRef.value, document.querySelector('#__nuxt') ? document.querySelector('#__nuxt') : document.body)
  setCordsPosition(tooltipRef.value, contentRef.value, props.position)
}

const handlerMouseEnter = () => {
  if (props.delay) {
    setTimeout(() => {
      activeTooltip.value = true
      nextTick(insertTooltip)
    }, Number(props.delay))
  } else {
    activeTooltip.value = true
    nextTick(insertTooltip)
  }
}

const removeTooltip = () => {
  activeTooltip.value = false
}

const handleResize = () => {
  if (!tooltipRef.value) return

  nextTick(() => setCordsPosition(tooltipRef.value, contentRef.value, props.position))

  for (let index = 0; index < 300; index++) {
    setTimeout(() => {
      setCordsPosition(tooltipRef.value, contentRef.value, props.position)
    }, index)
  }
}

const handleMouseEnterTooltip = () => {
  isHoverTooltip.value = true
  handlerMouseEnter()
}

const handleMouseLeaveTooltip = () => {
  isHoverTooltip.value = false
  removeTooltip()
}

const handleMouseLeave = () => {
  if (props.interactivity) {
    setTimeout(() => {
      if (!isHoverTooltip.value) {
        removeTooltip()
      }
    }, 250)
  } else {
    removeTooltip()
  }
}

const handleMouseDownNotHover = (evt) => {
  if (!evt.target.closest('.tooltip') && !evt.target.closest('.tooltip-content')) {
    removeTooltip()
  }
}

watch(() => props.modelValue, (val) => {
  activeTooltip.value = val
  if (val) {
    nextTick(insertTooltip)
  }
})

onMounted(() => {
  window.addEventListener('popstate', () => {
    document.querySelectorAll('.tooltip').forEach((tooltip) => {
      tooltip.remove()
    })
  })

  window.addEventListener('resize', handleResize)
  if (props.notHover) {
    window.addEventListener('mousedown', handleMouseDownNotHover)
    window.addEventListener('touchstart', handleMouseDownNotHover)
  }
 
})

onBeforeUnmount(() => {
  activeTooltip.value = false
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousedown', handleMouseDownNotHover)
})
</script>

<style scoped>

.tooltip-enter-active,
.tooltip-leave-active {
  @apply transition-all duration-[0.25s] ease-[ease];
}
.tooltip-enter,
.tooltip-leave-to {
  @apply opacity-0;
}
.tooltip-enter.top,
.tooltip-leave-to.top {
  @apply translate-y-[5px];
}
.tooltip-enter.bottom,
.tooltip-leave-to.bottom {
  @apply translate-y-[-5px];
}
.tooltip-enter.left,
.tooltip-leave-to.left {
  @apply translate-x-[5px];
}
.tooltip-enter.right,
.tooltip-leave-to.right {
  @apply translate-x-[-5px];
}
.dark .tooltip {
  @apply bg-gray-400 text-white;
}
.dark .tooltip:not(.change-color) {
  @apply text-white;
}
.tooltip {
  @apply bg-gray-800 text-white absolute z-[1000000] text-center text-[0.85rem] max-w-[350px] min-w-[30px] min-h-[30px] px-2.5 py-[5px] rounded-xl;
}
.tooltip.loading {
  @apply text-white/20;
}
.tooltip.loading * {
  @apply opacity-50 pointer-events-none;
}
.tooltip__loading {
  @apply w-[22px] h-[22px] absolute block -translate-x-2/4 -translate-y-2/4 opacity-100 rounded-[50%] left-2/4 top-2/4 after:( border-transparent border-r-white animate-[loadingTooltip_0.6s_ease_infinite] rounded-[inherit] border-2 border-solid) before:(border-transparent border-r-white animate-[loadingTooltip_0.6s_linear_infinite] rounded-[inherit] border-2 border-solid border-r-dashed );
}
.tooltip__loading:after {
  animation: loadingTooltip 0.6s ease infinite;
}

.tooltip__loading:after,
.tooltip__loading:before {
  @apply content-[""] absolute w-full h-full box-border transition-all duration-[0.25s] ease-[ease] block shadow-[0_0_0_0] shadow-black;
}
.tooltip__loading:before {
  animation: loadingTooltip 0.6s linear infinite;
}
.tooltip.borderThick {
  @apply bg-white text-gray-800 shadow-[0_2px_10px_0] shadow-black/05 before:w-full before:h-full before:z-[-1] before:content-[""] before:absolute before:rounded-[inherit] before:left-0 before:top-0;
}
.tooltip.borderThick.top {
  @apply border-b-gray-800 border-b-4 border-solid after:bottom-[-7px];
}
.tooltip.borderThick.left {
  @apply border-r-gray-800 border-r-4 border-solid after:right-[-7px];
}
.tooltip.borderThick.right {
  @apply border-l-gray-800 border-l-4 border-solid after:left-[-7px];
}
.tooltip.borderThick.bottom {
  @apply border-t-gray-800 border-t-4 border-solid after:top-[-7px];
}
.tooltip.borderThick:before {
  background: inherit;
}
.tooltip.borderThick:after {
  @apply !bg-primary
}
.tooltip.border {
  @apply bg-white text-gray-800 border-gray-800 border-2 border-solid before:w-full before:h-full before:z-[-1] before:content-[""] before:absolute before:rounded-[inherit] before:left-0 before:top-0 after:border-gray-800 after:w-3 after:h-3 after:border-2 after:border-solid;
}
.tooltip.border:before {
  background: inherit;
}
.tooltip.circle {
  @apply rounded-[20px];
}
.tooltip.square {
  @apply rounded-none;
}
.tooltip.notArrow:after {
  @apply hidden;
}
.tooltip.shadow {
  @apply bg-white text-gray-800 shadow-[0_2px_10px_0] shadow-black/15 before:w-full before:h-full before:z-[-1] before:content-[""] before:absolute before:rounded-[inherit] before:left-0 before:top-0 after:shadow-[0_2px_10px_0] shadow-black/05;
}
.tooltip.shadow:before {
  @apply !bg-white
}
.tooltip.shadow:after {
  @apply !bg-white shadow-[0_2px_10px_0] shadow-black/15
}
.tooltip.isDark {
  @apply text-white bg-gray-200;
}
.tooltip.top:after {
  @apply bottom-[-3px] rounded-[0_0_2px_0];
}
.tooltip.bottom:after,
.tooltip.top:after {
  @apply bg-gray-800 content-[""] absolute w-2.5 h-2.5 -translate-x-2/4 rotate-45 z-[-2] left-2/4;
}
.tooltip.bottom:after {
  @apply top-[-3px] rounded-[2px_0_0_0];
}
.tooltip.left:after {
  @apply right-[-3px] rounded-[0_2px_0_0];
}
.tooltip.left:after,
.tooltip.right:after {
  @apply content-[""] absolute w-2.5 h-2.5 -translate-y-2/4 rotate-45 z-[-2] top-2/4;
  background: inherit;
}
.tooltip.right:after {
  @apply left-[-3px] rounded-[0_0_0_2px];
}


@keyframes loadingTooltip {
    0% {
        -webkit-transform: rotate(0);
        transform: rotate(0)
    }

    to {
        -webkit-transform: rotate(1turn);
        transform: rotate(1turn)
    }
}

</style>
