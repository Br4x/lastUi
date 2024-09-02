<template>
  <div :class="['input-parent flex  justify-center flex-col relative', `input-parent--state-${state}`, {
    'input-parent--border': !!border,
    'input-parent--shadow': !!shadow,
    'w-full': block,
    'square': square
  }]">
    <div
      :class="['input-content rounded-none flex items-center justify-start relative rounded-xl', { 'mt-5': label || labelPlaceholder }]">

      <input v-if="!colorPicker" :disabled="loading || disabled" :class="['input  placeholder-transparent  transition-all duration-[0.25s] ease-[ease] w-50 pl-3 pr-[13px] py-[7px] rounded-[inherit] border-2 border-solid border-transparent focus:pl-[15px] min-h-10 outline-none box-border list-none',
    {
      'input--has-icon': !!icon || attrs.type === 'color',
      'input--has-icon--after': !!iconAfter,
      '!bg-transparent': transparent,
      'w-full': block,
      'cursor-not-allowed': disabled,
      'text-white': textWhite,
      'bg-green-200 text-green-500 focus:(bg-gradient-to-r from-green-200 via-green-100 to-green-200)': state == 'success',
      'bg-red-200 text-red-500 focus:(bg-gradient-to-r from-red-200 via-red-100 to-red-200)': state == 'danger',
      'bg-yellow-200 text-yellow-500 focus:(bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200)': state == 'warn',
      'bg-gray-100 text-gray-500 focus:(bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200)': !state,
      'bg-opacity-50 cursor-wait': loading,
      'primary': state == 'primary'
    }, inputClass]" :value="modelValue" v-bind="attrs" :type="attrs.type === 'color' ? 'text' : attrs.type" :id="getId"
        @input="$emit('update:model-value', $event.target.value)" />

      <label v-if="(label || attrs.placeholder || labelPlaceholder) && !colorPicker" :for="getId" :class="['input__label',
    {
      'input__label--placeholder': labelPlaceholder,
      '': modelValue !== '' || attrs.type == 'date' || attrs.type == 'time',
      'input__label--label opacity-100 visible pointer-events-auto -translate-x-0.5 translate-y-[-77%] text-xs': label,
      'text-green-500': state == 'success',
      'text-red-500': state == 'danger',
      'text-yellow-500': state == 'warn',
      'text-primary': state == 'primary',
      'input__label--hidden opacity-0 invisible': modelValue !== ''
    }
  ]">
        {{ label || attrs.placeholder || labelPlaceholder }}
      </label>

      <label v-if="attrs.placeholder" :for="getId"
        :class="['input__label', { 'input__label--hidden opacity-0 invisible': modelValue !== '' }]">
        {{ attrs.placeholder }}
      </label>

      <span v-if="icon || attrs.type === 'color'" :class="[
    'input__icon overflow-hidden absolute w-9 h-9 flex items-center justify-center shadow-[12px_0_10px_-10px] transition-all duration-[0.25s] ease-[ease] rounded-[inherit] left-0 right-auto',
    {
      'text-green-500 shadow-[-15px_10px_10px_-10px] shadow-green-500 focus:bg-green-100': state == 'success',
      'text-red-500 shadow-[-15px_10px_10px_-10px] shadow-red-500 focus:bg-red-100': state == 'danger',
      'text-yellow-500 shadow-[-15px_10px_10px_-10px] shadow-yellow-500 focus:bg-yellow-100': state == 'warn',
      'text-primary shadow-[-15px_10px_10px_-10px] shadow-primary focus:bg-primary-100': state == 'primary',
      'focus:bg-gray-100': !state,
      'input__icon--after': iconAfter,
      'input__icon--click': !!attrs['click-icon']
    }
  ]" @click="clickOnIcon">
        <input ref="colorInput" :value="modelValue" @input="$emit('update:model-value', $event.target.value)" class="[&::-webkit-color-swatch]:border-none cursor-pointer [&::-webkit-color-swatch]:shadow-lg [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch-wrapper]:p-px w-8 h-8 p-px " v-if="attrs.type === 'color'" type="color">
        <i v-else :class="icon" />
      </span>

      <div v-if="loading"
        class="input__loading  absolute w-[22px] h-[22px] pointer-events-none box-border cursor-default rounded-[50%] right-4 after:border-primary after:animate-[rotateInputLoading_0.8s_ease_infinite] after:rounded-[inherit] after:border-t-transparent after:border-x-transparent after:border-2 after:border-solid before:border-primary before:animate-[rotateInputLoading_0.8s_linear_infinite] before:opacity-20 before:rounded-[inherit] before:border-t-transparent before:border-x-transparent before:border-2 before:border-dashed before:border-solid" />

      <div class="input__affects">
        <div class="input__affects__1"></div>
        <div class="input__affects__2"></div>
        <div class="input__affects__3"></div>
        <div class="input__affects__4"></div>
      </div>
    </div>

    <div v-if="progress > 0"
      :class="['input__progress', { 'input__progress--danger': progress < 33, 'input__progress--warn': progress < 66 && progress > 33, 'input__progress--success': progress > 66 }]">
      <div class="input__progress__bar" :style="{ width: `${progress}%` }"></div>
    </div>

    <span class="input__message" v-if="hint" :class="{
    'text-green-500': state == 'success',
    'text-red-500': state == 'danger',
    'text-yellow-500': state == 'warn',
    'text-primary': state == 'primary',
  }
    ">
      {{ hint }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  labelPlaceholder: { type: String, default: '' },
  label: { type: String, default: '' },
  block: Boolean,
  iconAfter: Boolean,
  visiblePassword: Boolean,
  loading: Boolean,
  color: { type: String, default: null },
  state: { type: String, default: null },
  progress: { type: Number, default: 0 },
  border: Boolean,
  shadow: Boolean,
  transparent: Boolean,
  textWhite: Boolean,
  square: Boolean,
  disabled: Boolean,
  icon: String,
  hint: String,
  inputClass: String,
  colorPicker: Boolean
})

const emit = defineEmits(['update:model-value', 'click-icon'])
const attrs = useAttrs()
const colorInput = ref()
const isVisiblePassword = ref(false)
let uid = Math.random().toString(36).substr(2, 9)

const getId = computed(() => `input--${attrs.id || uid}`)
function clickOnIcon(event: MouseEvent) {
  if (attrs.type !== 'color') {
    emit('click-icon', (event.target as HTMLInputElement).value)
  } else {
    colorInput.value.click()
  }
}
</script>

<style scoped>
.input-content+.input__message {
  @apply pt-0.5;
}

.input-content--has-color .input:focus {
  @apply border-b-[rgba(var(--color), 1)] border-b-2 border-solid;
}

.input-content--has-color .input:focus~.input__icon,
.input-content--has-color .input:focus~.input__label,
.input-content--has-color .input:focus~.input__label--placeholder {
  @apply text-[rgba(var(--color), 1)];
}

.input:focus.input--has-icon:not(.input--has-icon--after) {
  @apply pl-10;
}

.input:focus.input--has-icon:not(.input--has-icon--after)~.input__icon {
  @apply shadow-[15px_10px_10px_-10px_rgba(0, 0, 0, 0.05)];
}

.input:focus.input--has-icon:not(.input--has-icon--after)~.input__label:not(.input__label--placeholder):not(.input__label--label) {
  @apply left-11;
}

.input:focus~.input__icon {
  @apply -translate-x-1.5 -translate-y-1.5;
  background-color: rgb(243 244 246 / var(--un-bg-opacity));
}

.input:focus~.input__icon--after {
  @apply translate-x-1.5 -translate-y-1.5;
}

.input:focus~.input__label:not(.input__label--placeholder):not(.input__label--label) {
  @apply opacity-0 left-5;
}

.input:focus~.input__label--placeholder {
  @apply opacity-100 visible pointer-events-auto translate-x-[-3%] translate-y-[-77%] text-xs;
}

.input__label {
  @apply absolute text-[0.8rem] transition-all duration-[0.25s] ease-[ease] cursor-text select-none pointer-events-none w-full h-full flex items-center justify-start opacity-40 left-[13px];

}


.input__label--hidden.input__label--placeholder {
  @apply opacity-100 visible pointer-events-auto translate-x-[-3px] translate-y-[-80%] text-xs;
}

.input--has-icon {
  @apply pl-10;
}

.input--has-icon~.input__label {
  @apply left-11;
}

.input--has-icon--after {
  @apply pl-[7px] pr-10;
}

.input--has-icon--after~.input__label {
  @apply left-[13px];
}

.input--has-icon--after.input__label--label,
.input--has-icon:focus--has-icon--after~.input__label--placeholder {
  @apply translate-x-[-25px] translate-y-[-80%];
}

.input--has-icon:focus--has-icon--after~.input__label {
  @apply left-11;
}

.input__icon {
  box-shadow: 12px 0 10px -10px rgba(0, 0, 0, 0.15);
}

.input__icon--after {
  @apply shadow-[-12px_0_10px_-10px_rgba(0, 0, 0, 0.05)] left-auto right-0;
}

.input__icon--click {
  @apply pointer-events-auto cursor-pointer hover:shadow-[-15px_10px_10px_-10px_rgba(0, 0, 0, 0.05)] hover:-translate-x-1.5 hover:-translate-y-1.5;
}

.input__icon--click:hover.input__icon--after {
  @apply translate-x-1.5 -translate-y-1.5;
}

.input__message {
  @apply text-[0.7rem] relative transition-all duration-[0.25s] ease-[ease] overflow-hidden px-[7px] py-0 text-left;
}

.input__message--success {
  @apply text-[rgba(var(--success), 1)];
}

.input__message--danger {
  @apply text-[rgba(var(--danger), 1)];
}

.input__message--warn {
  @apply text-[rgba(var(--warn), 1)];
}

.input__message--dark {
  @apply text-[rgba(var(--dark), 1)];
}

.input__message--primary {
  @apply text-[rgba(var(--primary), 1)];
}

.input__progress {
  @apply w-[95%] relative h-0.5 overflow-hidden mt-[5px] rounded-[5px] left-[2.5%] bg-gray-100;
}

.input__progress--danger .input__progress__bar {
  @apply bg-red-200
}

.input__progress--warn .input__progress__bar {
  @apply bg-yellow-200
}

.input__progress--success .input__progress__bar {
  @apply bg-green-200
}

.input__progress__bar {
  @apply w-[32%] h-0.5 max-w-full transition-all duration-[0.25s] ease-[ease] rounded-[5px];
}

.input__loading:after {
  -webkit-animation: rotateInputLoading 0.8s ease infinite;
}

.input__loading:after,
.input__loading:before {
  @apply box-border absolute w-full h-full content-[""] top-0;
  -webkit-box-sizing: border-box;
}

.input__loading:before {
  -webkit-animation: rotateInputLoading 0.8s linear infinite;
}

.input-parent--border .input__icon {
  @apply shadow-none;
  background: transparent !important;
  -webkit-box-shadow: none !important;
}

.input-parent--border .input-content {
  @apply rounded-none;
}

.input-parent--border .input-content .input__affects {
  @apply w-full h-full absolute pointer-events-none left-0 top-0;
}

.input-parent--border .input-content .input__affects__1 {
  @apply border-b-[rgba(var(--gray-3), 1)] w-full h-0.5 absolute transition-all duration-[0.25s] ease-[ease] border-b-2 border-solid bottom-0;
  -webkit-transition: all 0.25s ease;
}

.input-parent--border .input-content .input__affects__2 {
  @apply border-b-[rgba(var(--color), 1)] w-0 h-0.5 absolute transition-all duration-[0.25s] ease-[ease] -translate-x-2/4 border-b-2 border-solid left-2/4 bottom-0;
  -webkit-transition: all 0.25s ease;
  -webkit-transform: translate(-50%);
}

.input-parent--border .input-content .input {
  @apply rounded-none;
  background: transparent;
}

.input-parent--border .input-content .input:focus~.input__affects .input__affects__2 {
  @apply w-full;
}

.input-parent--shadow .input__icon {
  @apply z-[100];
  background: transparent;
}

.input-parent--shadow .input-content .input__affects {
  @apply w-full h-full absolute pointer-events-none z-10 rounded-[inherit] left-0 top-0;
}

.input-parent--shadow .input-content .input__affects__1 {
  @apply shadow-[0_6px_25px_-6px_rgba(0, 0, 0, 0.05)] w-full h-full absolute transition-all duration-[0.25s] ease-[ease] z-[200] rounded-[inherit] top-0;
  -webkit-box-shadow: 0 6px 25px -6px rgba(0, 0, 0, 0.05);
  -webkit-transition: all 0.25s ease;
}

.input-parent--shadow .input-content .input {
  @apply rounded-none border-2 border-solid border-transparent focus:translate-y-[3px];
  background: transparent;
}

.input-parent--shadow .input-content .input:focus {
  -webkit-transform: translateY(3px);
}

.input-parent--shadow .input-content .input:focus~.input__icon {
  @apply opacity-100 shadow-[0_10px_20px_-5px_rgba(0, 0, 0, 0.05)];
  background: rgba(var(--background), 1) !important;
  -webkit-box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.05) !important;
}

.input-parent--shadow .input-content .input:focus~.input__affects .input__affects__1 {
  @apply translate-y-[3px] shadow-[0_0_3px_0_rgba(0, 0, 0, 0.05)];
  -webkit-transform: translateY(3px);
  -webkit-box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.05);
}

@keyframes rotateInputLoading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg)
  }

  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn)
  }
}
</style>