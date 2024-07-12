<template>
  <div class="absolute inset-0 mx-auto aspect-[1/1] w-1/2 ">
    <canvas class="h-full w-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
      ref="canvasRef" @pointerdown="updatePointerInteraction($event.clientX - pointerInteractionMovement)"
      @pointerup="updatePointerInteraction(null)" @pointerout="updatePointerInteraction(null)" @mousemove="updateMovement($event.clientX)"
      @touchmove="$event.touches[0] && updateMovement($event.touches[0].clientX)" />
  </div>
</template>

<script setup lang="ts">
import createGlobe from 'cobe';
import { useSpring } from '@vueuse/motion';

// Props
const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      onRender: () => { },
      devicePixelRatio: 2,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 0.4,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [251 / 255, 100 / 255, 21 / 255],
      glowColor: [1, 1, 1],
      markers: [
        { location: [14.5995, 120.9842], size: 0.03 },
        { location: [19.076, 72.8777], size: 0.1 },
        { location: [23.8103, 90.4125], size: 0.05 },
        { location: [30.0444, 31.2357], size: 0.07 },
        { location: [39.9042, 116.4074], size: 0.08 },
        { location: [-23.5505, -46.6333], size: 0.1 },
        { location: [19.4326, -99.1332], size: 0.1 },
        { location: [40.7128, -74.006], size: 0.1 },
        { location: [34.6937, 135.5022], size: 0.05 },
        { location: [41.0082, 28.9784], size: 0.06 },
      ]
    })
  },
  rotationSpeed: {
    type: Number,
    default: 0.0005 // Default rotation speed
  }
});

// Refs and reactive variables
const canvasRef = ref();
const globe = ref()
let phi = 0;
let width = 0;
const pointerInteracting = ref(null);
const pointerInteractionMovement = ref(0);

// Spring pour l'animation
const r = ref(0);
useSpring(r, {
  from: 0,
  to: 0,
  config: {
    mass: 1,
    tension: 280,
    friction: 40,
    precision: 0.001,
  }
});

const updatePointerInteraction = (value) => {
  pointerInteracting.value = value;
  if (canvasRef.value) {
    canvasRef.value.style.cursor = value ? 'grabbing' : 'grab';
  }
};

const updateMovement = (clientX) => {
  if (pointerInteracting.value !== null) {
    const delta = clientX - pointerInteracting.value;
    pointerInteractionMovement.value = delta;
    r.value = delta / 200;
  }
};


const onResize = () => {
  if (canvasRef.value) {
    width = canvasRef.value.offsetWidth;
  }
};

const onRender = (state) => {
  if (!pointerInteracting.value) phi += props.rotationSpeed;
  state.phi = phi + r.value;
  state.width = width * 2;
  state.height = width * 2;
};

onMounted(() => {
  window.addEventListener('resize', onResize);
  onResize();

  globe.value = createGlobe(canvasRef.value, {
    ...props.config,
    width: width * 2,
    height: width * 2,
    onRender
  });

  setTimeout(() => (canvasRef.value.style.opacity = '1'), 500);
});

onUnmounted(() => {
  globe.value.destroy();
  window.removeEventListener('resize', onResize);
});
</script>
