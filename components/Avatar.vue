<template>
  <div>
    <div
      class="avatar-content bg-gray-100 text-gray-500 z-1 w-11 h-11 relative transition-all duration-[0.25s] ease-[ease] select-none rounded-[35%]"
      :class="{
      'history after:(content-[\'\'] absolute w-full h-full bg-[#FFE53B] -z-1 rounded-[inherit] left-0 top-0)': history,
      'after:(bg-gradient-to-tr from-[#FFE53B] via-[#df376b] to-[#c52d91])': historyGradient,
      'rounded-1/2': circle,
      'rounded-0': square,
      'hidden': isHidden,
      'after:-top-0.5': size && history,

    }" :style="{ width: `${size}px`, height: `${size}px` }" v-if="!isHidden">
      <div
        class="avatar text-gray-500 overflow-hidden flex items-center justify-center  w-full h-full transition-all duration-[0.25s] ease-[ease] shadow-[inset_0px_0px_0px_0px_rgba(0, 0, 0, 0.05)] rounded-[inherit]"
        :class="{ [`avatar--letter--${textLength}`]: textLength > 2, ' border-white m-0.5 border-2 border-solid': history }">
        <template v-if="text">{{ shortText }}</template>
        <i v-if="icon" :class="[props.icon, 'bg-gray-500']" />
        <slot />
      </div>

      <div v-if="loading"
        class="avatar__loading absolute w-full z-100 h-full flex items-center justify-center rounded-inherit left-0 top-0 bg-black bg-opacity-50">
        <div
          class="h-3/5 w-3/5 flex items-center justify-center relative rounded-1/2 after:(box-border absolute w-full h-full animate-[rotateInputLoading_0.8s_ease_infinite] content-[''] rounded-inherit border-t-transparent border-x-transparent border-2 border-solid border-white top-0) before:(box-border absolute w-full h-full animate-[rotateInputLoading_0.8s_linear_infinite] opacity-20 content-[''] rounded-inherit border-t-transparent border-x-transparent border-2 border-dashed border-white border-solid top-0)" />
      </div>

      <Badge v-if="hasBadge || props.badge || writing || badgeClass" :badge-class="badgeClass"
        :badge-position="badgePosition" :circle="circle" :writing="writing">
        <template v-if="hasBadge" #badge>
          <slot name="badge" />
        </template>
      </Badge>
    </div>

    <div v-if="isLatest"
      class="w-full h-full absolute z-[300] flex items-center justify-center text-white font-semibold select-none rounded-[inherit] left-0 top-0 bg-black bg-opacity-50"
      v-show="parentEl && parentEl.avatars.length - index - 1 != 0">
      +{{ parentEl && parentEl.avatars.length - index - 1 }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useParentElement } from '@vueuse/core'

const props = defineProps({
  badgePosition: {
    type: String,
    default: 'top-right'
  },
  pointer: Boolean,
  circle: Boolean,
  square: Boolean,
  history: Boolean,
  loading: Boolean,
  historyGradient: Boolean,
  writing: Boolean,
  badgeClass: String,
  size: String,
  icon: String,
  text: String,
  badge: Boolean
})

const emits = defineEmits(['input'])
const slots = useSlots()
const textLength = ref(0)
const index = ref(0)

const parentEl = useParentElement() as Ref<HTMLElement>

const hasBadge = computed(() => {
  return slots.badge
})

const shortText = computed(() => {
  if (props.text) {
    const text = props.text?.trim()
    let getLetters = text
    if (text?.length > 5) {
      getLetters = text.split(/\s/g).map((item: string) => {
        return item[0]
      }).join('').toUpperCase()
      textLength.value = getLetters?.length
    } else {
      textLength.value = getLetters[0]?.length
    }

    return getLetters
  }

})

const isHidden = computed(() => {
  return parentEl.value && parentEl.value.max && index.value > Number(parentEl.value.max) - 1
})

const isLatest = computed(() => {
  return parentEl.value && index.value == Number(parentEl.value.max) - 1
})

</script>


<style>
.avatar-content.history .avatar {
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  margin: 2px;
}

.avatar-content.change-color-badge .avatar__badge .avatar__points__point {
  background: -color("background");
}

.avatar-content.change-color:hover .avatar {
  @apply shadow-[inset_0px_0px_40px_0px_rgba(0, 0, 0, 0.1)];
}

.avatar-content:hover .avatar {
  @apply shadow-[inset_0px_0px_40px_0px_rgba(0, 0, 0, 0.04)];
}

.avatar-content:hover img {
  @apply scale-110;
}

.avatar-content.component--is-color .avatar {
  @apply text-[-color("background")];
}

.avatar-content.component--is-color .avatar__points .avatar__points__point {
  background: -color("background");
}

.avatar i {
  @apply text-[1.4rem];
}

.avatar img {
  @apply w-full h-auto block transition-all duration-[0.25s] ease-[ease] rounded-[inherit];
}

.avatar--letter--3 {
  @apply text-[0.9rem];
}

.avatar--letter--4 {
  @apply text-[0.8rem];
}

.avatar--letter--5 {
  @apply text-[0.7rem];
}

.avatar--letter--6 {
  @apply text-[0.6rem];
}

.avatar__loading {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, .5);
  z-index: 100;
  height: 100%;
  border-radius: inherit;
}

.avatar__loading__animate:after,
.avatar__loading__animate:before {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  content: "";
}

.avatar__loading__animate:after {
  border-radius: inherit;
  border: 2px solid transparent;
  border-bottom-color: #fff;
  -webkit-animation: rotateInputLoading .8s ease infinite;
  animation: rotateInputLoading .8s ease infinite;
}

@keyframes rotateInputLoading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}

@keyframes point {
  0% {
    opacity: 1;
  }

  50% {
    opacity: .4;
    transform: scale(0.5);
  }

  100% {
    opacity: 1;
  }
}
</style>