<template>
  <Dialog @close="onClose">
    <div class="text-sm flex flex-col justify-center text-center items-center gap-4 mb-2">
      <div class="text-sm" v-html="body" />
      <Input v-model="value" :type="min || max || step ? 'number': 'text'" /> 
    </div>
    <template #footer>
      <div class="flex gap-2 w-full justify-center">
        <Button label="Confirm" @click="callback(value); $emit('close')" />
        <Button label="Cancel" transparent @click="onClose(); $emit('close')" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  body: String,
  default: String,
  min: String,
  max: String,
  step: String,
  onClose: {
    type: Function,
    default: () => {
    },
    required: false
  },
  callback: {
    type: Function,
    default: () => {
    },
    required: false
  }
})

const value = ref(props.default)
</script>
