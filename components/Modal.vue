<template>
    <Dialog :title="title" @close="onClose">
        <div v-html="body" class="text-sm" />
        <template #footer>
            <div class="flex gap-2 w-full justify-center">
                <Button v-for="(button, label) in buttons" @click="button(); $emit('close')"
                    v-bind="label === 'Cancel' ? { transparent: true } : {}">
                    {{ label }}
                </Button>
            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
const show = ref(true)

defineProps({
    title: String,
    body: String,
    buttons: Object,
    resizable: Boolean,
    onClose: {
        type: Function,
        default: () => {
        }
    }
})
</script>
