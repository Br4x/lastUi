<template>
  <defs>
    <linearGradient ref="linearGradient" :x1="`${x1}%`" :x2="`${x2}%`" :id="id">
      <slot />
    </linearGradient>
  </defs>
</template>

<script setup>
const props = defineProps({
  id: String,
  initial: Object,
  animate: Object,
  transition: Object,
});
const linearGradient = ref();
const test = ref(true)
const x1 = ref(props.animate.x1[0])
const x2 = ref(props.animate.x2[0])



watch(
  () => x1.value,
  () => {
    console.log('x1 changed', x1.value)
  }
);

const easeOutElastic = (n) => {
  return n === 0
    ? 0
    : n === 1
      ? 1
      : (2 ** (-10 * n)) * Math.sin((n * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1
}


const animateGradient = async () => {

  if (test.value) {
    x1.value = props.animate.x1[1]
    x2.value = props.animate.x2[1]
  } else {
    x1.value = props.animate.x1[0]
    x2.value = props.animate.x2[0]
  }
  test.value = !test.value
  console.log('lol', x1.value, x2.value)
};

onMounted(() => {
  x1.value = props.animate.x1[0]
  x2.value = props.animate.x2[0]

  const x1Transition = useTransition(x1, {
    duration: 1000,
    transition: easeOutElastic, onStarted() {
      console.log('started')
    },
    onFinished() {
      console.log('finished')
    }
  })
  const x2Transition = useTransition(x2, props.transition)

  console.log(x1Transition, x2Transition)
});

watch(
  () => props.animate,
  () => {
    animateGradient();
  }
);

defineExpose({
  animateGradient,
});
</script>
