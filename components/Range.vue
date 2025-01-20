<template>

<div class="flex gap-2 items-end text-sm font-semibold">
  <span :class="{'pb-2': !!icon}">{{ label }}</span>
  <div class="flex flex-col items-center w-fit text-black font-bold relative">
    <input type="number" class="ml-4 w-full outline-none text-center bg-transparent":min="min" :max="max" :value="modelValue" :step="step"  
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
    <input type="range" :min="min" :max="max" :value="modelValue" :step="step" v-bind="$attrs"  class="range max-w-xs" :class="{'range--has-icon': !!icon}"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
    <i :class="icon" class="absolute top-7 pointer-events-none" :style="{left: `calc(${(parseInt(modelValue) / parseInt(max)) * 120}px - ${(parseInt(modelValue) / parseInt(max)) * 32}px + 8px)`}"/>
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
  label:String,
  icon:String
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.range {
  @apply h-4 w-30 cursor-pointer appearance-none overflow-hidden bg-transparent rounded-2xl;
}
.range.range--has-icon{
  @apply !h-8
}
.range::-webkit-slider-runnable-track {
  @apply h-2 w-full bg-secondary bg-opacity-30 rounded-2xl;
}
.range::-webkit-slider-thumb {
  @apply relative h-4 w-4 bg-white appearance-none text-[oklch(100%_0_0/1)] -translate-y-2/4 shadow-[0_0_0_3px_#673ab7_inset,0_0,calc(100rem_*_-1_-_0.6rem)_0_0_100rem_#4f46e5] rounded-2xl border-none top-2/4;
}

.range.range--has-icon::-webkit-slider-thumb {
  @apply  !h-8 !w-8 ;
}
</style>