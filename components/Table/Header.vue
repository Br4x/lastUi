<template>
  <th ref="header" class="table__th" :class="{ sort: sort, 'isSorted': isSorted }" :data-sort-type="sortDirection">
    <div class="table__th__content">
      <slot />
      <div v-if="sort" class="table__th__content__icons">
        <i class="i-mynaui-chevron-up icon-arrow icon-sort-1" />
        <i class="i-mynaui-chevron-up icon-arrow icon-sort-2" />
      </div>
    </div>
  </th>
</template>

<script setup>
const props = defineProps({
  sort: Boolean,
  sortDirection: String,
  isSorted: Boolean,
})

const header = ref()

onMounted(() => {
  header.value.style.width = `${header.value.scrollWidth}px`
})
</script>

<style scoped>
.table__th {
  @apply text-left transition-all duration-[0.25s] ease-[ease] text-[0.8rem] px-3 py-2.5 border-0;
}
.table__th.sort .table__th__content {
  @apply pointer-events-none;
}
.table__th.sort:hover {
  @apply bg-gray-200
}
.table__th[data-sort-type="asc"].isSorted .icon-sort-2 {
  @apply mt-[-15px] !rotate-360;
}
.table__th[data-sort-type="asc"].isSorted .icon-sort-1 {
  @apply  -mt-px;
}
.table__th[data-sort-type="desc"].isSorted .icon-sort-2 {
  @apply mt-[-15px];
}
.table__th[data-sort-type="desc"].isSorted .icon-sort-1 {
  @apply !rotate-[-180deg] -mt-px;
}
.table__th__content {
  @apply justify-start transition-all duration-[0.25s] ease-[ease];
}
.table__th__content,
.table__th__content__icons {
  @apply flex items-center;
}
.table__th__content__icons {
  @apply justify-center flex-col ml-[15px] scale-[0.8];
}
.table__th__content .icon-arrow {
  @apply relative block;
}
.table__th__content .icon-arrow.icon-sort-1 {
  @apply rotate-0  transition-all duration-[0.5s];
}
.table__th__content .icon-arrow.icon-sort-2 {
  @apply rotate-[-180deg] mt-[-7px]  transition-all duration-[0.5s];
}
</style>
