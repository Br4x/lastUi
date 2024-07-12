<template>
  <svg :width="svgDimensions.width" :height="svgDimensions.height" xmlns="http://www.w3.org/2000/svg"
    :class="['pointer-events-none absolute left-0 top-0 transform-gpu stroke-2', className]"
    :viewBox="`0 0 ${svgDimensions.width} ${svgDimensions.height}`" fill="none">
    <path :d="pathD" :stroke="pathColor" :stroke-width="pathWidth" :stroke-opacity="pathOpacity"
      stroke-linecap="round" />
    <path :d="pathD" :stroke-width="pathWidth" :stroke="`url(#${id})`" stroke-opacity="1" stroke-linecap="round" />
    <defs>
      <MotionLinearGradient ref="motionGradient" class="transform-gpu" :id="id" gradientUnits="userSpaceOnUse"  :animate="gradientCoordinates" :transition="{
    delay,
    duration,
    transition: [0.16, 1, 0.3, 1],
    repeat: Infinity,
    repeatDelay: 0
  }">
        <stop :stop-color="gradientStartColor" stop-opacity="0"></stop>
        <stop :stop-color="gradientStartColor"></stop>
        <stop offset="32.5%" :stop-color="gradientStopColor"></stop>
        <stop offset="100%" :stop-color="gradientStopColor" stop-opacity="0"></stop>
      </MotionLinearGradient>
    </defs>
  </svg>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';

// Props
const props = defineProps({
  className: String,
  containerRef: Object,
  fromRef: Object,
  toRef: Object,
  curvature: { type: Number, default: 0 },
  reverse: { type: Boolean, default: false },
  duration: { type: Number, default: () => 3000 },
  delay: { type: Number, default: 0 },
  pathColor: { type: String, default: 'gray' },
  pathWidth: { type: Number, default: 2 },
  pathOpacity: { type: Number, default: 0.2 },
  gradientStartColor: { type: String, default: '#ffaa40' },
  gradientStopColor: { type: String, default: '#9c40ff' },
  startXOffset: { type: Number, default: 0 },
  startYOffset: { type: Number, default: 0 },
  endXOffset: { type: Number, default: 0 },
  endYOffset: { type: Number, default: 0 }
});

// Internal state
const id = 'hah';
const motionGradient = ref()
const pathD = ref('');
const svgDimensions = ref({ width: 0, height: 0 });

const gradientCoordinates = ref(
  props.reverse
    ? {
        x1: [90, -10],
        x2: [100,0],

      }
    : {
        x1: [10, 110],
        x2: [0, 100],
      }
);

const updatePath = () => {
  if (props.containerRef && props.fromRef && props.toRef) {
    const containerRect = props.containerRef.getBoundingClientRect();
    const rectA = props.fromRef.getBoundingClientRect();
    const rectB = props.toRef.getBoundingClientRect();

    const svgWidth = containerRect.width;
    const svgHeight = containerRect.height;
    svgDimensions.value = { width: svgWidth, height: svgHeight };

    const startX =
      rectA.left - containerRect.left + rectA.width / 2 + props.startXOffset;
    const startY =
      rectA.top - containerRect.top + rectA.height / 2 + props.startYOffset;
    const endX =
      rectB.left - containerRect.left + rectB.width / 2 + props.endXOffset;
    const endY =
      rectB.top - containerRect.top + rectB.height / 2 + props.endYOffset;

    const controlY = startY - props.curvature;
    const d = `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`;
    pathD.value = d;
  }
};

onMounted(() => {
  updatePath();

  const resizeObserver = new ResizeObserver(() => {
    updatePath();
  });
  if (props.containerRef) {
    resizeObserver.observe(props.containerRef);
  }

  onUnmounted(() => {
    resizeObserver.disconnect();
  });
});

function animateGradient() {
  motionGradient.value.animateGradient()
}


watchEffect(() => {
  updatePath();
});


defineExpose({
  animateGradient
})
</script>
