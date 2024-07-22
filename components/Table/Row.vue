<template>
  <tr
    :class="{'table__tr': true, 'selected': isSelected, 'isExpand': !!expandContainer, 'expand': $slots.expand}"
    @click="handleClick"
  >
    <slot />
  </tr>
</template>

<script setup lang="ts">
import Expand from '@/components/Table/Expand.vue'
import { render, createVNode } from 'vue'

const props = defineProps({
  data: { type: Object, required: true },
  isSelected: Boolean,
  notClickSelected: Boolean,
  openExpandOnlyTd: Boolean
})
const emit= defineEmits(['update:modelValue', 'click', 'selected'])
const expandContainer = ref()
const slots = useSlots()

const insertAfter = (element:HTMLElement) => {
  const parent = document.querySelector('.table__tr')?.parentNode
  if (document.querySelector('.table__tr')?.nextSibling) {
    parent?.insertBefore(element, document.querySelector('.table__tr')!.nextSibling)
  } else {
    parent?.appendChild(element)
  }
}

watch(() => props.data, () => {
  if (expandContainer.value) {
    expandContainer.value.hidden = true
    expandContainer.value = null
  }
})

const handleClickHasExpand = () => {
  if (expandContainer.value) {
    expandContainer.value.hidden = !expandContainer.value.hidden
    expandContainer.value = null
  } else {
    const colspan = document.querySelectorAll('thead th')?.length
    expandContainer.value = createVNode(Expand, { colspan }, {default: slots.expand})
    expandContainer.value.hidden = false
    render(expandContainer.value, document.createElement('div'))
    insertAfter(expandContainer.value.el)
  }
}

const handleClick = (evt:any) => {
  if (slots.expand) {
    handleClickHasExpand()
  }
  if (!props.notClickSelected) {
    emit('update:modelValue', props.data)
    emit('selected', props.data)
  }
  emit('click', evt)
}
</script>

