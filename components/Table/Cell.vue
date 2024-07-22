<template>
  <td
    :class="{'table__td': true, 'w-[23px]': checkbox, 'underline cursor-pointer': edit}"
    @click="$emit('click', $event)"
  >
    <slot />
  </td>
</template>

<script setup lang="ts">
defineProps({
  checkbox: { type: Boolean, default: false },
  edit: { type: Boolean, default: false }
})

</script>

<style scoped>
.table__td {
  @apply transition-all duration-[0.25s] ease-[ease] text-[0.8rem] px-3 py-2.5 border-0 last:rounded-[0_15px_15px_0] first:rounded-[15px_0_0_15px];
}
</style>
