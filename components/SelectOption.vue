<template>
  <button
    :disabled="option.disabled"
    :class="{
      'select__option text-sm': true,
      activeOption: isActive,
      isHover: isHover,
      isMultiple: isMultiple,
    }"
    @click="$emit('clicked', option)"
  >
    <Checkbox v-if="isMultiple" :checked-force="isActive" :label="option.label" />
    <template v-else>
      {{ option?.label }} 
    </template>
  </button>
</template>

<script setup lang="ts">
import type { SelectOption } from '@/types/Select';

defineProps({
  option: { type: Object as PropType<SelectOption>, required:true},
  isHover: Boolean,
  isMultiple: Boolean,
  isActive: Boolean,
  value:[Number,String]
})
</script>
