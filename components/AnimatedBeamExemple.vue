<template>
 <div
      class="relative flex w-full max-w-[500px] items-center justify-center overflow-hidden rounded-lg border bg-white p-10 md:shadow-xl"
      ref="lolRef" @click="animatedBeam.animateGradient()">
      
      <div class="flex h-full w-full flex-col items-stretch justify-between gap-10">
        <div class="flex flex-row justify-between">
          <div ref="circleRef1"
            class="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]">
          </div>
          <div ref="circleRef2"
            class="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]">
          </div>
        </div>
      </div>
      <AnimatedBeam ref="animatedBeam" :duration="3" :container-ref="lolRef" :fromRef="circleRef1" :toRef="circleRef2" />
    </div>
</template>

<script setup lang="ts">
const lolRef = ref();
const circleRef1 = ref();
const circleRef2 = ref();
const animatedBeam = ref();
</script>
