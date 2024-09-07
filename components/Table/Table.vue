<template>
  <div class="table-content">
    <header v-if="$slots.header || searchable" class="table__header">
      <Input v-if="searchable" icon="i-mynaui-search" v-model="search" type="search" input-class="!bg-white text-sm"
        name="new-password" autocomplete="new-password" autofocus />
      <slot name="header" />
    </header>
    <div :class="['table', { isSelectedValue: modelValue, striped: striped, multipleSelection: multipleSelection }]">
      <table>
        <thead ref="theadRef" class="table__thead">
          <TableHeader v-if="hasSelection">
            <Checkbox v-model="isAllSelected" v-if="multipleSelection" @update:model-value="selectAll" />
          </TableHeader>
          <TableHeader v-for="column in columns" :sort-by="column.key" :sort="column.sortable"
            :is-sorted="column.key === sortCol" :key="column.label" @click="sort(column.key)"
            :sort-direction="sortDirection">
            <i v-if="column.icon" :class="column.icon" />{{ column.label }}
          </TableHeader>
        </thead>
        <tbody class="table__tbody">
          <TableRow v-for="item in filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
            :data="item">
            <TableCell v-if="hasSelection" checkbox>
              <Checkbox :checked-force="isSelected(item)" @update:model-value="select(item)" />
            </TableCell>
            <TableCell v-for="column in columns">
              <slot :item="item" :name="column.key">
                {{ item[column.key] }}
              </slot>
            </TableCell>
            <template #expand>
              <slot name="expand" />
            </template>
          </TableRow>
        </tbody>
        <tbody v-if="!hasData" class="table_not-found">
          <tr>
            <td :colspan="colspan">{{ $slots.notFound || emptyText }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <footer v-if="items.length > pageSize" class="table__footer">
      <Pagination v-model="currentPage" :length="Math.ceil(items.length / pageSize)" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { find, forEach, includes, orderBy } from 'lodash';
import type { Column } from '@/types/Table';

const props = defineProps({
  modelValue: { type: Array<any>, default: () => [] },
  striped: Boolean,
  loading: Boolean,
  emptyText: String,
  items: { type: Array<any>, required: true },
  columns: { type: Array<Column>, required: true },
  hasSelection: Boolean,
  multipleSelection: Boolean,
  valueKey: { type: String, default: 'id' },
  pageSize: { type: Number, default: 10 },
  searchable: Boolean
})

const colspan = ref(0)
const theadRef = ref()
const emit = defineEmits(['update:modelValue', 'sort'])
const sortCol = ref()
const sortDirection = ref('')
const currentPage = ref(1)
const isAllSelected = ref(false)
const expandItem = ref()
const search = ref('')

onMounted(() => {
  const tds = theadRef.value.querySelectorAll('th')
  colspan.value = tds.length
})

const orderedItems = computed(() => {
  if (sortCol.value) {
    // @ts-ignore
    return orderBy(props.items, sortCol.value, sortDirection.value)
  }
  return props.items
})

const filteredItems = computed(() => {
  if (!search.value) return orderedItems.value

  return orderedItems.value.filter(item => {
    let found = false
    forEach(item, attr => {
      if (!found && ['string', 'number'].includes(typeof attr)) {
        found = includes(attr.toString().toLowerCase(), search.value.toLowerCase())
      }
    })
    return found
  })
})

function select(item: any) {
  if (props.multipleSelection) {
    const newVal = props.modelValue
    const index = newVal.indexOf(item)
    if (index !== -1) {
      newVal.splice(index, 1)
    } else {
      newVal.push(item)
    }
    emit('update:modelValue', newVal)
  } else {
    emit('update:modelValue', item)
  }
}

const hasData = computed(() => {
  return props.items && props.items.length > 0
})

function selectAll(value: boolean) {
  if (value) {
    emit('update:modelValue', props.items)
  } else {
    emit('update:modelValue', [])
  }
}

function sort(column: string) {
  sortCol.value = column
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  emit('sort', column)
}

function isSelected(item: any) {
  if (props.multipleSelection) {
    return !!find(props.modelValue, (val: any) => val[props.valueKey] === item[props.valueKey])
  }
  // @ts-ignore
  return item[props.valueKey] === props.modelValue[props.valueKey]
}
</script>

<style scoped>
.table-content {
  @apply w-full rounded-2xl shadow;
}

.table {
  @apply w-full text-[0.9rem] overflow-auto m-0;
}

.table table {
  @apply w-full min-w-[500px] m-0 border-collapse border-0;
}

.table.striped .table__tr:nth-child(2n) {
  @apply bg-gray-100
}

.table_not-found {
  @apply hidden text-center w-full p-5;
}

.table_not-found tr {
  @apply text-center;
}

.table_not-found tr td {
  @apply p-5 border-0;
}

.table__tbody:empty {
  @apply hidden;
  background: #000;
}

.table__tbody:empty~.table_not-found {
  @apply table-row-group;
}

.table.isSelectedValue tr {
  @apply cursor-pointer;
}

.table__footer {
  @apply px-2.5 py-2 rounded-[0_0_14px_14px] bg-gray-100;
}

.table__header {
  @apply w-full p-2.5 rounded-[14px_14px_0_0] bg-gray-100;
}

.table__header~.table .table__th:first-child,
.table__header~.table .table__th:last-child {
  @apply rounded-none;
}

.table__thead {
  @apply w-full;
}

.table__thead .table__th {
  @apply bg-gray-100 !font-semibold
}

.table__thead .table__th:first-child {
  @apply rounded-[14px_0_0_0];
}

.table__thead .table__th:last-child {
  @apply rounded-[0_14px_0_0];
}

.multipleSelection .table__tr .table__td {
  @apply rounded-none;
}

.table__tr {
  @apply p-[5px] border-b border-b-gray-200;
}

.table__tr.expand {
  @apply cursor-pointer;
}

.table__tr.change-color .table__td {
  @apply text-primary !bg-primary/10;
}

.table__tr.change-color .table__td:hover {
  @apply text-primary !bg-primary/20;
}

.table__tr:first-of-type .table__td:last-child {
  @apply rounded-[0_0_15px_0];
}

.table__tr:first-of-type .table__td:first-child {
  @apply rounded-[0_0_0_15px];
}

.table__tr.isExpand:first-of-type .table__td {
  @apply rounded-none !bg-gray-100;
}

.table__tr.isExpand:not(:first-of-type) .table__td {
  @apply !bg-gray-100;
}

.table__tr.isExpand:not(:first-of-type) .table__td:last-child {
  @apply rounded-[0_15px_0_0];
}

.table__tr.isExpand:not(:first-of-type) .table__td:first-child {
  @apply rounded-[15px_0_0_0];
}

.table__tr.isExpand:not(:first-of-type)+.table__tr__expand td {
  @apply rounded-[0_0_15px_15px];
}

.table__tr.selected .table__td {
  @apply text-primary !bg-primary/10;
}

.table__tr .table__td {
  @apply !bg-background/10 text-left;
}

.table__tr.change-color:hover .table__td {
  @apply !bg-primary/20;
}

.table__tr:hover .table__td {
  @apply !bg-gray-50;
}

.table__tr__expand,
.table__tr__expand td {
  @apply transition-all duration-[0.25s] ease-[ease] border-0;
}

.table__tr__expand td {
  @apply p-0 !bg-gray-100;
}

.table__tr__expand td .table__expand__td__content {
  @apply overflow-hidden block transition-all duration-[0.25s] ease-[ease];
}

.table__tr__expand td .table__expand__td__content__sub {
  @apply z-[1] relative px-[15px] py-2.5;
}

.fade-expand-enter-active,
.fade-expand-leave-active {
  @apply transition-all duration-[0.25s] ease-[ease];
}

.fade-expand-enter,
.fade-expand-leave-to {
  @apply opacity-0;
}

.fade-expand-enter td .table__expand__td__content,
.fade-expand-leave-to td .table__expand__td__content {
  @apply h-0;
}

.table__th {
  @apply text-left transition-all duration-[0.25s] ease-[ease] text-[0.8rem] px-3 py-2.5 border-0;
}

.table__th.sort .table__th__content {
  @apply pointer-events-none;
}

.table__th.sort:hover {
  @apply bg-gray-200;
}

.table__th[data-sort-type="asc"] .icon-sort-2 {
  @apply mt-[-7px] !rotate-45;
}

.table__th[data-sort-type="asc"] .icon-sort-1 {
  @apply !rotate-45 -mt-px;
}

.table__th[data-sort-type="desc"] .icon-sort-2 {
  @apply mt-[-7px];
}

.table__th[data-sort-type="desc"] .icon-sort-1 {
  @apply !rotate-[-135deg] -mt-px;
}

.table__th__content {
  @apply justify-start transition-all duration-[0.25s] ease-[ease];
}

.table__th__content,
.table__th__content__icons {
  @apply flex items-center;
}

.table__th__content__icons {
  @apply justify-center flex-col ml-[7px] scale-[0.8];
}

.table__th__content .icon-arrow {
  @apply relative block;
}

.table__th__content .icon-arrow.icon-sort-1 {
  @apply rotate-45;
}

.table__th__content .icon-arrow.icon-sort-2 {
  @apply rotate-[-135deg];
}

.table__td {
  @apply transition-all duration-[0.25s] ease-[ease] text-xs px-3 py-2.5 border-0 last:rounded-[0_15px_15px_0] first:rounded-[15px_0_0_15px];
}

.table__td.isCheckbox {
  @apply w-[23px];
}

.table__td.isEdit {
  @apply underline cursor-pointer;
}
</style>
