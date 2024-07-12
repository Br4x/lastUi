<template>
  <div
    class="absolute w-3 h-3 border-white text-[0.6rem] text-white font-bold z-200 text-text rounded-1/2 border-2 border-solid bg-red -right-1 -bottom-1"
    :class="{
      ' w-auto h-auto min-w-4.5 flex items-center justify-center ': hasSlot || writing,
      ' text-background leading-[0.9rem] min-h-4.5 px-[3px] py-0 rounded-lg': hasSlot || writing,
      '-right-0.5 -bottom-0.5': circle,
      '-top-0.5 bottom-auto': badgePosition === 'top-right' && circle,
      '-top-1 bottom-auto': badgePosition === 'top-right',
      '-left-0.5 right-auto -top-0.5 bottom-auto': badgePosition === 'top-left' && circle,
      '-left-1 right-auto -top-1 bottom-auto': badgePosition === 'top-left',
      '-left-0.5 right-auto': badgePosition === 'bottom-left' && circle,
      '-left-1 right-auto': badgePosition === 'bottom-left',
      '-right-0.5 left-auto': badgePosition === 'bottom-right' && circle,
      '-right-1 left-auto': badgePosition === 'bottom-right',
      [badgeClass || '']: true
    }">
    <template v-if="writing">
      <div class="relative flex items-center justify-center">
        <div class="bg-white w-1.5 h-1.5 mx-0.5 my-0 rounded-1/2 animate-[point_1.2s_ease_infinite]" />
        <div class="bg-white w-1.5 h-1.5 mx-0.5 my-0 rounded-1/2 animate-[point_1.2s_ease_infinite_0.4s]" />
        <div class="bg-white w-1.5 h-1.5 mx-0.5 my-0 rounded-1/2 animate-[point_1.2s_ease_infinite_0.8s]" />
      </div>
    </template>
    <slot name="badge" />
  </div>
</template>

<script setup lang="ts">

defineProps({
  badgePosition: String,
  writing: Boolean,
  badgeClass: String,
  circle: Boolean,
})

const slots = useSlots()
const hasSlot = computed(() => {
  return slots.badge
})
</script>
