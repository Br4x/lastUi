<template>
  <div :class="[
    'pagination-content',
    {
      buttonsDotted: buttonsDotted,
      circle: circle,
      square: square,
      disabled: disabled,
      notMargin: notMargin,
      'component--primary': true
    }
  ]">
    <template v-if="!onlyArrows && !slots.default">
      <div :style="{ left: `${leftActive}px` }" :class="{ move: activeClassMove }" class="pagination__active">
        {{ buttonsDotted ? '' : modelValue }}
      </div>
    </template>
    <button v-if="!notArrows" @click="prevPage" :disabled="!infinite && val <= 1" class="pagination__arrow prev">
      <slot name="arrowPrev">
        <i class="i-mynaui-chevron-left" />
      </slot>
    </button>
    <div v-if="slots.default" class="pagination__slot">
      <slot />
    </div>
    <div v-else ref="paginationRef" class="pagination">
      <template v-for="page in pages">

        <button  v-if="typeof page === 'number'" :ref="el => setDynamicRef(el, page)" :class="{
    'pagination__button': true,
    active: page === modelValue,
    prevActive: page === modelValue - 1,
    nextActive: page === modelValue + 1,
    disabled: disabledItems.includes(page),
    loading: loadingItems.includes(page),
  }" :key="page" @click="emit('update:modelValue', page)">
          <template v-if="!buttonsDotted">
            {{ page }}
          </template>
        </button>

        <div v-else :class="{
    'pagination__dotted': true,
    next: modelValue === length ? false : page === '...>',
  }" @click="handleDottedClick(page)">
          <span class="dotted">...</span>
          <span class="con-arrows">
            <i class="i-mynaui-chevron-right" />
            <i class="i-mynaui-chevron-right" />
          </span>
        </div>

      </template>
    </div>
    <button v-if="!notArrows" :disabled="!infinite && val >= length" class="pagination__arrow next" @click="nextPage">
      <slot name="arrowNext">
        <i class="i-mynaui-chevron-right" />
      </slot>
    </button>
    <div v-if="progress" class="pagination__progress">
      <div :style="{ width: `${(modelValue * 100) / length}%` }" class="progress"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Number,
  infinite: { type: Boolean, default: false },
  progress: { type: Boolean, default: false },
  notMargin: { type: Boolean, default: false },
  buttonsDotted: { type: Boolean, default: false },
  notArrows: { type: Boolean, default: false },
  onlyArrows: { type: Boolean, default: false },
  circle: { type: Boolean, default: false },
  square: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  disabledItems: { type: Array, default: () => [] },
  loadingItems: { type: Array, default: () => [] },
  length: { type: Number, default: 0 },
  max: { type: Number, default: 9 },
  dottedNumber: { type: Number, default: 5 }
})

const emit = defineEmits(['update:modelValue'])
const val = ref(0)
const leftActive = ref(42)
const activeClassMove = ref(false)
const paginationRef = ref()
const slots = useSlots()
const btns = ref([])

const isMobile = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 600
  }
  return false
})

const getButtons = (start = 1, end = 6) => {
  const buttons = []
  for (let i = start > 0 ? start : 1; i <= end; i++) {
    buttons.push(i)
  }
  return buttons
}

const pages = computed(() => {
  const max = isMobile.value ? 5 : props.max
  const even = max % 2 === 0 ? 1 : 0
  const prevRange = Math.floor(max / 2)
  const nextRange = props.length - prevRange + 1 + even

  if (props.modelValue >= prevRange && props.modelValue <= nextRange && !props.buttonsDotted) {
    const start = props.modelValue - prevRange + 2
    const end = props.modelValue + prevRange - 2 - even

    return [1, '<...', ...getButtons(start, end), '...>', props.length]
  } else if (!props.buttonsDotted && props.length > 6) {
    return [
      ...getButtons(1, prevRange),
      '...>',
      ...getButtons(nextRange, props.length)
    ]
  } else if (props.buttonsDotted || props.length <= 6) {
    return getButtons(1, props.length == 0 ? 1 : props.length)
  }

  return []
})

function prevPage() {
  let newVal = val.value - 1
  if (newVal > 0) {
    emit('update:modelValue', newVal)
  } else if (props.infinite) {
    emit('update:modelValue', props.length)
  }
}

function nextPage() {
  let newVal = val.value + 1
  if (newVal <= props.length) {
    emit('update:modelValue', newVal)
  } else if (props.infinite) {
    emit('update:modelValue', 1)
  }
}

function setDynamicRef(el, index) {
  if (el) {
    btns.value[index] = el;

    if(btns.value[props.modelValue]) {
      nextTick(() => {
          leftActive.value = btns.value[props.modelValue].offsetLeft + paginationRef.value.offsetLeft
          setTimeout(() => {
            activeClassMove.value = false
          }, 300)
        })
    }
  }
}

const handleDottedClick = (text) => {
  let newVal = text === '...>' ? props.modelValue + props.dottedNumber : props.modelValue - props.dottedNumber
  if (newVal > props.length) {
    newVal = props.length
  } else if (newVal < 1) {
    newVal = 1
  }
  emit('update:modelValue', newVal)
}

watch(
  () => props.length,
  () => {
    nextTick(() => {
      const offsetLeftPagination = paginationRef.value.offsetLeft
      leftActive.value = btns.value[props.modelValue].offsetLeft + offsetLeftPagination
      setTimeout(() => {
        activeClassMove.value = false
      }, 300)
    })
  }
)

watch(
  () => props.modelValue,
  (value, prevValue) => {
    if (props.disabledItems.includes(value) || props.loadingItems.includes(value)) {
      let newVal = value
      if (value > prevValue) {
        newVal += 1
      } else {
        newVal -= 1
      }

      if (newVal > props.length) {
        newVal = props.infinite ? 1 : prevValue
      } else if (newVal <= 0) {
        newVal = props.infinite ? props.length : prevValue
      }
      val.value = newVal
      emit('update:modelValue', newVal)
    } else {
      
      val.value = value
      if (paginationRef.value) {
        activeClassMove.value = true
        nextTick(() => {
          leftActive.value = btns.value[val.value].offsetLeft + paginationRef.value.offsetLeft
          setTimeout(() => {
            activeClassMove.value = false
          }, 300)
        })
      }
    }
  }
)

onMounted(() => {
  val.value = props.modelValue
})
</script>

<style scoped>
.pagination-content {
  @apply relative flex self-center justify-center;
}

.pagination-content.notMargin .pagination__dotted {
  @apply m-0 bg-gray-200;
}

.pagination-content.notMargin .pagination__arrow {
  @apply m-0 rounded-none first-of-type:rounded-[12px_0_0_12px] last-of-type:rounded-[0_12px_12px_0];
}

.pagination-content.notMargin .pagination__button {
  @apply m-0 rounded-none;
}

.pagination-content.disabled {
  @apply opacity-50 pointer-events-none select-none;
}

.pagination-content.square .pagination__active,
.pagination-content.square .pagination__arrow,
.pagination-content.square .pagination__button {
  @apply rounded-none;
}

.pagination-content.circle .pagination__active,
.pagination-content.circle .pagination__arrow,
.pagination-content.circle .pagination__button {
  @apply rounded-[50%];
}

.pagination-content.buttonsDotted .pagination__arrow {
  @apply w-[15px] h-3 min-w-[15px] p-0 bg-transparent;
}

.pagination-content.buttonsDotted .pagination__arrow i {
  @apply w-5 h-5 before:w-px after:h-px;
}

.pagination-content.buttonsDotted .pagination__dotted {
  @apply w-3 h-3 text-[0.9rem] tracking-[1px];
}

.pagination-content.buttonsDotted .pagination__button {
  @apply w-3 h-3;
}

.pagination-content.buttonsDotted .pagination__button.active {
  @apply scale-100;
}

.pagination-content.buttonsDotted .pagination__active {
  @apply w-3 h-3 shadow-[0_2px_10px_0] shadow-primary/50 scale-100;
}

.pagination-content.buttonsDotted .pagination__active.move {
  @apply scale-[1.2];
}

.pagination {
  @apply flex self-center justify-center relative;
}

.pagination__progress {
  @apply w-[calc(100%_-_16px)] h-[3px] absolute rounded-[10px] -bottom-2 bg-gray-200;
}

.pagination__progress .progress {
  @apply w-0 h-full relative transition-all duration-[0.25s] ease-[ease] max-w-full rounded-[inherit] bg-primary;
}

.pagination__slot {
  @apply min-h-[36px] block flex;
}

.pagination__arrow,
.pagination__slot {
  @apply min-w-[36px] relative items-center justify-center;
}

.pagination__arrow {
  @apply bg-gray-200 w-auto h-9 flex transition-all duration-[0.25s] ease-[ease] mx-0.5 my-0 rounded-xl border-0 disabled:opacity-40 disabled:pointer-events-none;
}

.pagination__arrow:hover {
  @apply bg-gray-300
}

.pagination__arrow i {
  @apply w-5 h-5 relative block scale-[0.8] before:w-0.5 after:h-0.5;
}

.pagination__arrow.next i {
  @apply scale-[0.8];
}

.pagination__active {
  @apply bg-gradient-to-r from-primary to-indigo-600 absolute w-9 h-9 z-[100] flex items-center justify-center text-[0.9rem] transition-all duration-[0.25s] ease-[ease] text-white shadow-[0_5px_20px_0_rgba(var(--color), 0.3)] cursor-default rounded-xl left-2/4 top-0;
}

.pagination__active.move {
  @apply scale-110;
}

.pagination__button {
  @apply bg-gray-200 w-9 h-9 flex items-center justify-center text-[0.9rem] transition-all duration-[0.25s] ease-[ease] text-on-surface relative mx-0.5 my-0 p-0 rounded-xl border-0 active:scale-90;
}

.pagination__button.loading {
  @apply opacity-50 pointer-events-none select-none rounded-[50%];
}

.pagination__button.loading:after {
    border-radius: 50%;
    border-left: 2px solid #673ab7;
    border-bottom: 2px solid #673ab7;
    border-top: 2px solid #673ab7;
    border: 2px solid rgba(255,255,255, 0);
    border-right-color: #673ab7;
    -webkit-animation: loadingPagination .6s ease infinite;
    animation: loadingPagination .6s ease infinite;
}

.pagination__button.loading:before {
    border-radius: 50%;
    border-left: 2px dashed #673ab7;
    border-bottom: 2px dashed #673ab7;
    border-top: 2px dashed #673ab7;
    border: 2px solid rgba(255,255,255, 0);
    border-right: 2px dashed #673ab7;
    -webkit-animation: loadingPagination .6s linear infinite;
    animation: loadingPagination .6s linear infinite;
}

.pagination__button.loading:after,
.pagination__button.loading:before {
  @apply content-[""] absolute w-full h-full box-border transition-all duration-[0.25s] ease-[ease] block shadow-[0_0_0_0] shadow-primary;
}

.pagination__button.disabled {
  @apply opacity-40 pointer-events-none select-none;
}

.pagination__button:hover {
  @apply bg-gray-300
}

.pagination__button:active {
  @apply scale-90;
}

.pagination__active {
  @apply bg-primary absolute w-9 h-9 z-[100] flex items-center justify-center text-[0.9rem] transition-all duration-[0.25s] ease-[ease] text-white shadow-[0_5px_20px_0] shadow-primary/30 cursor-default rounded-xl left-2/4 top-0;
}

.pagination__active.move {
  @apply scale-110;
}

.pagination__dotted {
  @apply w-9 h-9 relative flex items-center justify-center text-[1.4rem] tracking-[2px] cursor-pointer mx-0.5 my-0;
}

.pagination__dotted:hover span.dotted {
  @apply opacity-0 transition-all duration-[0.25s] ease-[ease] -ml-px;
}

.pagination__dotted:hover .con-arrows {
  @apply opacity-100 transition-all duration-[0.25s] ease-[ease] -ml-px;
}

.pagination__dotted.next:hover span.dotted {
  @apply opacity-0 transition-all duration-[0.25s] ease-[ease] ml-px;
}

.pagination__dotted.next:hover .con-arrows {
  @apply opacity-100 transition-all duration-[0.25s] ease-[ease] ml-px;
}

.pagination__dotted span.dotted {
  @apply text-center -mr-0.5;
}

.pagination__dotted.next .con-arrows {
  @apply rotate-180 ml-[-5px];
}

.pagination__dotted .con-arrows {
  @apply w-5 h-5 absolute flex items-center justify-center opacity-0 transition-all duration-[0.1s] ease-[ease] ml-0.5;
}

.pagination__dotted .con-arrows i {
  @apply w-5 h-5 relative block -rotate-180 scale-[0.8] before:w-0.5 after:h-0.5 last:absolute last:ml-1.8 last:top-0;
}

@-webkit-keyframes loadingPagination {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0)
  }

  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn)
  }
}

@keyframes loadingPagination {
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
