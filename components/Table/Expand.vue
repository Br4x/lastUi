<template>
  <Transition name="fade-expand">
    <tr v-if="modelValue" class="table__tr__expand">
      <td :colspan="colspan" class="table__expand__td">
        <div ref="contentRef" class="table__expand__td__content">
          <div class="table__expand__td__content__sub">
            <slot />
          </div>
        </div>
      </td>
    </tr>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: Boolean,
  colspan: {
    type: Number,
    required: true
  }
})

const contentRef = ref()

watch(props.modelValue, (val) => {
  if (val) {
    setTimeout(() => {
      const el = contentRef.value
      if (el) {
        el.parentNode.removeChild(el)
      }
    }, 300)
  } else {
    nextTick(() => {
      const content = contentRef.value
      if (content) {
        content.style.height = `${content.scrollHeight}px`
      }
    })
  }
})

onMounted(() => {
  // Initial logic if required
})

onBeforeUnmount(() => {
  // Cleanup if necessary
})

</script>
