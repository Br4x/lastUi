<template>
  <div :key="name" :class="cardClasses">
    <div>{{ background }}</div>
    <div class="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <i :class="icon" class="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 class="text-xl font-semibold text-neutral-700 dark:text-neutral-300">{{ name }}</h3>
      <p class="max-w-lg text-neutral-400">{{ description }}</p>
    </div>

    <div :class="['pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100']">
      <NuxtLink :to="to" class="pointer-events-auto">
        <Button variant="ghost" size="sm">
          {{ cta }}
          <ArrowRightIcon class="ml-2 h-4 w-4" />
        </Button>
      </NuxtLink>
    </div>
    <div class="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
</template>

<script setup lang="ts">

// Props
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  className: {
    type: String,
    default: ''
  },
  background: {
    type: Object,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  cta: {
    type: String,
    required: true
  }
});

// Computed classes
const cardClasses = computed(() =>
  [
    "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
    "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
    "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
    props.className
  ].join(' ')
);
</script>
