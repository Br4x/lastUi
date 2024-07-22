<template>
  <div :class="['switch', {
    'switch--loading': props.loading,
    'switch--square': props.square,
    'switch--indeterminate': props.indeterminate,
    'switch--icon': props.icon,
    'component--primary': true,
  }]">
    <input type="checkbox" :checked="isChecked" v-bind="$attrs" @input="onChange" class="switch__input" />
    <div class="switch__circle">
      <slot name="circle"/>
    </div>
    <div ref="on" class="switch__text on">
      <slot name="on" />
    </div>
    <div ref="off" class="switch__text off">
      <slot name="off" />
    </div>
    <div class="switch__background"/>
  </div>
</template>


<script setup lang="ts">

const props = defineProps({
  modelValue: { type: [Boolean, Object, String], default: '' },
  val: { default: '' },
  notValue: { default: '' },
  loading: { type: Boolean, default: false },
  square: { type: Boolean, default: false },
  indeterminate: { type: Boolean, default: false },
  icon: { type: Boolean, default: false }
})

const emits = defineEmits(['update:model-value', 'change'])

const isChecked = computed(() => {
  let isChecked = false

  if (props.modelValue) {
    if (typeof props.modelValue == 'boolean') {
      isChecked = props.modelValue
    } else if (typeof props.modelValue == 'object' && props.modelValue !== null) {
      const array = props.modelValue
      const containValue = array.indexOf(props.val) === -1 &&
        JSON.stringify(array).indexOf(JSON.stringify(props.val)) === -1
      let indexVal = 0

      array.forEach((item: any, index: number) => {
        if (JSON.stringify(item) == JSON.stringify(props.val)) {
          indexVal = index
        }
      })

      if (containValue) {
        return false
      } else {
        return true
      }
    }
  } else {
    isChecked = false
  }
  return isChecked
})

function onChange(evt: any) {
    if (typeof props.modelValue == 'boolean') {
      emits('update:model-value', !props.modelValue)
    } else if (typeof props.modelValue == 'object' && props.modelValue !== null) {
      const array = props.modelValue
      const containValue = array.indexOf(props.val) === -1 &&
        JSON.stringify(array).indexOf(JSON.stringify(props.val)) === -1
      let indexVal = 0

      array.forEach((item: any, index: number) => {
        if (JSON.stringify(item) == JSON.stringify(props.val)) {
          indexVal = index
        }
      })

      if (containValue) {
        array.push(props.val)
      } else {
        array.splice(indexVal, 1)
      }

      emits('update:model-value', array)
    } else {
      if (props.val !== props.modelValue) {
        emits('update:model-value', props.val)
      } else {
        emits('update:model-value', props.notValue || null)
      }
    }
    emits('change', evt)
}
</script>

<style scoped>
@-webkit-keyframes rotateSwitch {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg)
  }

  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn)
  }
}

@keyframes rotateSwitch {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg)
  }

  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn)
  }
}

.switch {
  @apply text-white bg-gray-200 min-w-[48px] h-7 relative flex items-center justify-center transition-all duration-[0.25s] ease-[ease] overflow-hidden p-[5px] rounded-[20px] border-0 after:border-primary  after:rounded-[50%] after:border-r-transparent after:border-t-transparent after:border-4 after:border-dashed  before:border-primary before:rounded-[50%] before:border-r-transparent before:border-t-transparent before:border-4 before:border-solid active:scale-90;

}

.switch--icon .switch__input:checked~.switch__circle {
  @apply text-white;
}

.switch--icon .switch__circle {
  @apply shadow-none !bg-transparent;
}

.switch--icon .switch__circle i {
  @apply opacity-100 text-[1.3rem];
}

.switch--indeterminate .switch__input {
  @apply pointer-events-none;
}

.switch--indeterminate .switch__circle {
  @apply -translate-x-1/2 left-1/2;
}

.switch--square {
  @apply rounded-[5px];
}

.switch--square .switch__background,
.switch--square .switch__circle {
  @apply rounded-[5px];
}

.switch:after {
  animation: rotateSwitch 0.6s linear 0.25s infinite;
}

.switch:after,
.switch:before {
  @apply transition-all duration-[0s] ease-[ease] delay-[0s] opacity-0 invisible content-[""] absolute w-full h-full z-[200] pointer-events-none;
}

.switch:before {
  animation: rotateSwitch 0.6s ease 0.25s infinite;
}

.switch--loading {
  @apply w-7 min-w-[28px] pointer-events-none rounded-[20px];
}

.switch--loading .switch__circle {
  @apply rounded-[50%];
}

.switch--loading .switch__background {
  @apply !opacity-0;
}

.switch--loading:after,
.switch--loading:before {
  @apply opacity-100 visible transition-all duration-[0.25s] ease-[ease] delay-[0.3s];
  -webkit-transition: all 0.25s ease 0.3s;
}

.switch:hover {
  @apply bg-gray-300
}

.switch:active {
  -webkit-transform: scale(0.9);
}

.switch__background {
  @apply bg-primary w-full h-auto absolute z-[2] transition-all duration-[0.25s] ease-[ease-out] pb-[100%] rounded-[inherit] rounded-[50%] scale-100 -left-full;

}

.switch__text {
  @apply text-[0.7rem] transition-all duration-[0.25s] ease-[ease] delay-[0.05s] text-gray-500 z-[9] flex items-center justify-center relative overflow-hidden whitespace-nowrap pl-[25px] pr-[5px] py-[5px];
}

.switch__text.on {
  @apply -translate-x-full absolute opacity-0;
}

.switch__text i {
  @apply text-base opacity-70;
}

.switch__circle {
  @apply bg-white w-5 h-5 transition-all duration-[0.25s] ease-[ease] absolute z-10 text-gray-600 flex items-center justify-center rounded-[20px] left-1;
}

.switch__circle i {
  @apply text-[0.8rem];
}

.switch__input {
  @apply absolute w-full opacity-0 h-full z-[100] cursor-pointer m-0 rounded-[inherit] left-0 top-0;
}

.switch__input:active:checked~.switch__circle {
  @apply left-[calc(100%_-_30px)];
}

.switch__input:active~.switch__circle {
  @apply w-[25px];
}

.switch__input:checked~.switch__background {
  @apply opacity-100 w-full transition-all duration-[0.25s] ease-[ease] pb-[100%] rounded-[50%] scale-100 left-0;
}

.switch__input:checked~.switch__text {
  @apply text-white pl-[5px] pr-[25px];
}

.switch__input:checked~.switch__text i {
  @apply opacity-100;
}

.switch__input:checked~.switch__text.on {
  @apply translate-x-0 relative opacity-100;
}

.switch__input:checked~.switch__text.off {
  @apply translate-x-full absolute opacity-0;
}

.switch__input:checked~.switch__circle {
  @apply left-[calc(100%_-_24px)] shadow-[-5px_0_25px_0] shadow-white/500 text-white;
}
</style>