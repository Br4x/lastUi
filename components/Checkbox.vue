<template>
  <div :class="['checkbox-content', {
    'checkbox--checked': isChecked,
    'checkbox--disabled': attrs.disabled,
    'checkbox--loading': loading,
    'checkbox--label-before': labelBefore,
  }]">
    <div class="checkbox-con">
      <input type="checkbox" class="checkbox" :id="_uid" v-bind="attrs" :checked="checkedForce || isChecked" @change="change" />
      <div class="checkbox-mask">
        <i :class="icon" />
      </div>
    </div>
    <label class="checkbox-label" :for="_uid" :class="{ lineThrough: lineThrough }">
      {{ label }}
    </label>
  </div>
</template>


<script setup lang="ts">
const props = defineProps({
  modelValue: { type: [Boolean, Object, String], default: '' },
  val: { default: '' },
  notValue: { default: '' },
  indeterminate: { type: Boolean, default: false },
  lineThrough: { type: Boolean, default: false },
  checked: { type: Boolean, default: false },
  checkedForce: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  labelBefore: { type: Boolean, default: false },
  icon: {
    type: String,
    default: 'i-ic-baseline-check'
  },
  label: String
})

const emits = defineEmits(['update:model-value', 'mousedown', 'blur'])
const attrs = useAttrs()
const _uid = Math.random().toString(36).substr(2, 9)

onMounted(() => {
  if (props.checked && typeof props.modelValue == 'boolean') {
    emits('update:model-value', true)
  }
})

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
  } 
  return false
})

function change(evt: any) {
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
  emits('mousedown', evt)
}
</script>

<style scoped>
.checkbox-content {
  @apply flex items-center justify-start;
}

.checkbox-con {
  @apply w-[23px] h-[23px] relative z-[1] rounded-[9px];
}

.checkbox-mask {
  @apply w-full h-full absolute z-50 cursor-pointer pointer-events-none transition-all duration-[0.25s] ease-[ease] flex items-center justify-center z-[-1] box-border rounded-[32%] after:rounded-[inherit] before:transition-all before:duration-[0.25s] before:ease-[ease] before:border-[rgba(var(--gray-4), 1)] before:box-border before:rounded-[inherit] before:border-2 before:border-solid;
}

.checkbox-mask i:not(.icon-check) {
  @apply text-white text-[1.1em];
}

.checkbox-mask:after,
.checkbox-mask i:not(.icon-check) {
  @apply opacity-0 transition-all duration-[0.25s] ease-[ease] scale-50;
}

.checkbox-mask:after {
  @apply bg-primary
}

.checkbox-mask:after,
.checkbox-mask:before {
  @apply content-[""] absolute w-full h-full z-[-1] left-0 top-0;
}

.checkbox-mask:before {
  @apply transition-all duration-[0.25s] ease-[ease] border-2 border-gray-300;
}

.checkbox-mask .icon-check {
  @apply opacity-0 z-[200] bg-white;
}

.checkbox {
  @apply absolute w-full h-full opacity-0 z-[100] cursor-pointer m-0 p-0 left-0 top-0 disabled:opacity-0 disabled:pointer-events-none;
}

.checkbox:active~.checkbox-mask {
  @apply !bg-gray-300
}

.checkbox:hover~.checkbox-mask {
  @apply bg-gray-200
}

.checkbox:hover~.checkbox-mask:before {
  @apply border-gray-300 border-2 border-solid;
}

.checkbox:checked:hover~.checkbox-mask {
  @apply shadow-[0_3px_15px_0] shadow-primary/50;
}

.checkbox:checked~.checkbox-mask {
  @apply shadow-[0_0_0_0];
}

.checkbox:checked~.checkbox-mask i:not(.icon-check) {
  @apply opacity-100 transition-all duration-[0.25s] ease-[ease] delay-[0.15s] scale-100;
}

.checkbox:checked~.checkbox-mask .icon-check {
  @apply opacity-100;
}

.checkbox:checked~.checkbox-mask .icon-check span .line1:after {
  @apply w-full transition-all duration-[0.25s] ease-[ease] delay-[0.1s];
}

.checkbox:checked~.checkbox-mask .icon-check span .line2:after {
  @apply transition-all duration-[0.2s] ease-[ease] delay-[0.3s] h-full;
}

.checkbox:checked~.checkbox-mask:after {
  @apply opacity-100 scale-100;
}

.checkbox:checked~.checkbox-mask:before {
  @apply opacity-0 scale-[1.2];
}

.checkbox-label {
  @apply select-none cursor-pointer relative flex items-center justify-center text-[0.9rem] p-[7px] before:absolute before:w-0 before:h-0.5 before:content-[""];
}

.checkbox-label,
.checkbox-label:before {
  @apply transition-all duration-[0.25s] ease-[ease];
}

.checkbox-label:before {
  @apply bg-black
}

.checkbox--disabled {
  @apply pointer-events-none;
}

.checkbox--disabled .checkbox-label {
  @apply opacity-50;
}

.checkbox--disabled .checkbox-mask {
  @apply opacity-60;
  background: transparent !important;
}

.checkbox--checked .lineThrough {
  @apply opacity-40 before:w-[calc(100%_-_10px)];
}

.checkbox--loading {
  @apply pointer-events-none;
}

.checkbox--loading.checkbox--checked .checkbox-mask {
  @applu !bg-transparent;
}

.checkbox--loading.checkbox--checked .checkbox-mask:before {
  @apply border-primary opacity-100 rounded-[50%] border-t-transparent border-2 border-solid;
  animation: rotateCheckboxLoading 0.6s linear infinite;
}

.checkbox--loading.checkbox--checked .checkbox-mask:after {
  @apply opacity-0 scale-50;
}

.checkbox--loading .checkbox-mask {
  background: transparent !important;
}

.checkbox--loading .checkbox-mask:before {
  @apply border-gray-300  rounded-[50%] border-t-transparent border-2 border-solid;
  animation: rotateCheckboxLoading 0.6s linear infinite;
}

.checkbox--label-before .checkbox-label {
  @apply -order-1;
}

@keyframes rotateCheckboxLoading {
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