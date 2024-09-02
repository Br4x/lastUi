<template>
  <div 
    class="select__option-group" 
    :class="{ hidden }"
  >
    <h5>{{ label }}</h5>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  textFilter: String,
  label:String
})
const slots = useSlots()

const optionGroup = ref(true)
const hidden = ref(false)

const labels = computed(() => {
  let labels = ''
  const slotsDefault = slots.default?.() || []
  slotsDefault.forEach((item) => {
    if (item.type) {
      labels += (item.component?.props?.label || '')
    }
  })
  return labels
})

const clickOption = (value: any, label: any) => {
  const parent = getCurrentInstance()?.parent
  parent?.emit('clickOption', value, label)
}

watch(
  () => props.textFilter,
  (val) => {
    if (val) {
      hidden.value = labels.value.toLowerCase().indexOf(val.toLowerCase()) === -1
    } else {
      hidden.value = false
    }
    textFilter.value = val
  }
)
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
