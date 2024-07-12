<template>

<div class="flex gap-2 items-end text-sm font-semibold">
  {{ label }}
  <div class="flex flex-col items-center w-fit text-black font-bold">
    {{ modelValue }}
    <input type="range" :min="min" :max="max" :value="modelValue" :step="step" v-bind="$attrs"  class="range max-w-xs"
    @input="$emit('update:modelValue', $event.target.value)">
  </div>
</div>
</template>

<script setup lang="ts">
defineProps({
  min: {
    type: String,
    default: '0'
  },
  max: {
    type: String,
    default: '100'
  },
  step: {
    type: String,
    default: '1'
  },
  modelValue: [String, Number],
  label:String
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.range {
  @apply h-4 w-full max-w-52 cursor-pointer appearance-none overflow-hidden bg-transparent rounded-2xl;
}
.range::-webkit-slider-runnable-track {
  @apply h-2 w-full bg-secondary bg-opacity-30 rounded-2xl;
}
.range::-webkit-slider-thumb {
  @apply relative h-4 w-4 bg-white appearance-none text-[oklch(100%_0_0/1)] -translate-y-2/4 shadow-[0_0_0_3px_#673ab7_inset,0_0,calc(100rem_*_-1_-_0.6rem)_0_0_100rem_#673ab7] rounded-2xl border-none top-2/4;
}

</style>