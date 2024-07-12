<script setup lang="ts">
// import ripple, { rippleCut, rippleReverse } from '~/util/ripple'

const props = defineProps({
  ripple: { type: String, default: '' },
  label: { type: String, default: '' },
  activeDisabled: { type: Boolean, default: false },
  flat: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  gradient: { type: Boolean, default: false },
  relief: { type: Boolean, default: false },
  transparent: { type: Boolean, default: false },
  shadow: { type: Boolean, default: false },
  floating: { type: Boolean, default: false },
  icon:String,
  circle: { type: Boolean, default: false },
  square: { type: Boolean, default: false },
  size: { type: String, default: null },
  loading: { type: Boolean, default: false },
  upload: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  animationType: { type: String, default: '' },
  animateInactive: { type: Boolean, default: false },
  to: { type: String, default: null },
  href: { type: String, default: null },
  blank: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
})

const emits = defineEmits(['click'])

const handleClick = (evt: Event) => {
  if (props.to) {
    // Assuming you are using Vue Router
    // this.$router.push(props.to)
  } else if (props.href) {
    window.open(props.href, props.blank ? '_blank' : '_self')
  }
  emits('click', evt)
}
</script>

<template>
  <button :class="['button button--primary', `button--size-${props.size}`, {
    'button--active': !!props.active,
    'button--active-disabled': !!props.activeDisabled,
    'button--icon': !!props.icon,
    'button--circle': !!props.circle,
    'button--square': !!props.square,
    'button--loading': !!props.loading,
    'button--upload': !!props.upload,
    'button--block': !!props.block,
    'button--animate': !!$slots.animate,
    [`button--animate-${props.animationType}`]: !!props.animationType,
    'button--animate-inactive': !!props.animateInactive,
    'button--default': !props.flat && !props.border && !props.gradient && !props.relief && !props.transparent && !props.shadow && !props.floating,
    'button--flat': !!props.flat,
    'button--border': !!props.border,
    'button--gradient': !!props.gradient,
    'button--relief': !!props.relief,
    'button--transparent': !!props.transparent,
    'button--shadow': !!props.shadow,
    'button--floating': !!props.floating,
  }]" 
  v-bind="$attrs" @click="handleClick">
    <div class="button__content">
      <i v-if="icon" :class="icon" />{{ label }}<slot />
    </div>
    <div v-if="$slots.animate" :class="['button__animate', `button__animate--${props.animationType}`]">
      <slot name="animate" />
    </div>
    <div v-if="props.loading" class="button__loading" />
  </button>
</template>

<style scoped>
.button {
  @apply text-white outline-none mt-1 mr-1 mb-1 ml-1 rounded-3 transition-all duration-[0.25s] ease-[ease] relative select-none z-[1] overflow-hidden flex items-center justify-center text-[0.8rem] box-border p-0 border-0 disabled:pointer-events-none disabled:opacity-[0.35] bg-primary;
}
.button.component-dark.button--transparent {
  @apply text-white
}
.button--fff:focus {
  @apply text-[#1e1e1e];
}
.button__content {
  @apply px-2 py-2 w-full flex items-center justify-center;
}
.button--active-disabled {
  @apply pointer-events-none opacity-60;
}
.button.button--animate:not(.button--animate-inactive)
  .button__content
  i {
  @apply text-[1.15rem];
}
.button.button--animate:not(.button--animate-inactive):hover
  .button__content {
  @apply -translate-x-full;
  -webkit-transform: translate(-100%);
}
.button.button--animate:not(.button--animate-inactive):hover
  .button__animate {
  @apply translate-x-0;
  -webkit-transform: translate(0);
}
.button.button--animate:not(.button--animate-inactive).button--animate-vertical:hover
  .button__content {
  @apply -translate-y-full opacity-0;
  -webkit-transform: translateY(-100%) !important;
}
.button.button--animate:not(.button--animate-inactive).button--animate-vertical:hover
  .button__animate {
  @apply translate-x-0;
  -webkit-transform: translate(0) !important;
}
.button.button--animate:not(.button--animate-inactive).button--animate-scale:hover
  .button__content {
  @apply opacity-0 scale-[1.4];
  -webkit-transform: scale(1.4) !important;
}
.button.button--animate:not(.button--animate-inactive).button--animate-scale:hover
  .button__animate {
  @apply opacity-100 scale-100;
  -webkit-transform: scale(1);
}
.button.button--animate:not(.button--animate-inactive).button--animate-rotate:hover
  .button__content {
  @apply !rotate-180 opacity-0;
}
.button.button--animate:not(.button--animate-inactive).button--animate-rotate:hover
  .button__animate {
  @apply opacity-100 rotate-[0];
}
.button.button--animate:not(.button--animate-inactive)
  .button__content,
.button__animate {
  @apply transition-[-webkit-transform] duration-[0.25s] ease-[ease] transition-transform duration-[0.25s] ease-[ease];
  -webkit-transition: -webkit-transform 0.25s ease;
  transition: transform 0.25s ease, -webkit-transform 0.25s ease;
}
.button__animate {
  @apply absolute w-full h-full flex items-center justify-center translate-x-full pointer-events-none left-0 top-0;
}
.button__animate--vertical {
  @apply translate-y-full;
}
.button__animate--scale {
  @apply opacity-0 scale-50;
}
.button__animate--rotate {
  @apply -rotate-180 opacity-0;
}
.button--block {
  @apply w-full block;
}
.button--upload:after {
  @apply content-[""] absolute w-full h-full z-[1200] animate-[btnupload_0.7s_ease_infinite] box-border left-0 top-0;
  background: rgba(var(--color), 0.4);
 animation: btnupload 0.7s ease infinite;
}
.button--loading {
  @apply pointer-events-none select-none;
}
.button .button__loading {
  @apply bg-primary bg-opacity-80 w-full h-full absolute flex items-center justify-center rounded-[inherit] left-0 top-0 after:animate-[btnload_0.6s_linear_infinite] after:rounded-[50%] after:border-l-[hsla(0,0%,100%,0.6)] after:border-2 after:border-solid after:border-[hsla(0,0%,100%,0)] after:border-dotted before:animate-[btnload_0.6s_ease_infinite] before:rounded-[50%] before:border-l-white before:border-2 before:border-solid before:border-[hsla(0,0%,100%,0)];
}
.button .button__loading:after {
  animation: btnload 0.6s linear infinite;
}
.button .button__loading:after,
.button .button__loading:before {
  @apply content-[""] w-[17px] h-[17px] absolute box-border;

}
.button .button__loading:before {
    border: 2px solid hsla(0, 0%, 100%, 0);
    border-left-color: #fff;
    border-radius: 50%;
    animation: btnload .6s ease infinite;
}

.button .button__loading:after {
    border: 2px solid hsla(0, 0%, 100%, 0);
    border-left: 2px dotted hsla(0, 0%, 100%, .6);
    border-radius: 50%;
    animation: btnload .6s linear infinite;
}
.button--size-xl {
  @apply rounded-[20px];
}
.button--size-xl .button__content {
  @apply text-[1.1rem] px-5 py-[15px];
}
.button--size-large {
  @apply text-base rounded-[15px];
}
.button--size-large .button__content {
  @apply px-[15px] py-2.5;
}
.button--size-small {
  @apply text-xs rounded-[9px];
}
.button--size-small .button__content {
  @apply px-2.5 py-[5px];
}
.button--size-mini {
  @apply text-[0.6rem] rounded-[7px];
}
.button--size-mini .button__content {
  @apply px-2 py-[3px];
}
.button--circle {
  @apply rounded-[25px];
}
.button--square {
  @apply rounded-none;
}
.button--icon {
  @apply flex items-center justify-center;
}
.button--icon .button__content {
  @apply p-2;
}
.button--icon i {
  @apply text-[1.15rem];
}
.button--default {
  @apply text-white bg-primary;
}
.button--default.button--active,
.button--default:hover {
  @apply shadow-[0_10px_20px_-10px] shadow-primary translate-y-[-3px];
}
.button--flat {
  @apply text-[rgba(var(--color),1)];
  background: rgba(var(--color), 0.15);
}
.button--flat.button--dark {
  @apply text-[rgba(var(--text),1)];
}
.button--flat:hover {
  background: rgba(var(--color), 0.25);
}
.button--flat:focus {
  transition: all 0.25s ease, background 0.25s ease 0.25s;
}
.button--flat.button--active,
.button--flat:focus,
.button--floating {
  @apply text-white;
  background: rgba(var(--color), 1);
}
.button--floating {
  @apply translate-y-[-3px] hover:-translate-y-1.5;
}
.button--floating,
.button--floating:hover {
  @apply shadow-[0_8px_20px_-6px] shadow-primary;
}
.button--floating:hover {
  @apply translate-y-[-6px]
}
.button--floating.button--active,
.button--floating:focus {
  @apply translate-x-0 shadow-[0_0_0_0] shadow-primary;
}
.button--border {
  @apply text-primary before:content-[""] before:border-primary before:absolute before:w-full before:h-full before:pointer-events-none before:transition-all before:duration-[0.25s] before:ease-[ease] before:box-border before:rounded-[inherit] before:border-2 before:border-solid before:left-0 before:top-0 hover:before:border-[rgba(var(--color),0.5)] hover:before:border-2 hover:before:border-solid;
  background: rgba(var(--color), 0);
}
.button--border:before {
  background: transparent;
  -webkit-transition: all 0.25s ease;
  -webkit-box-sizing: border-box;
}
.button--border.button--active,
.button--border:focus,
.button--gradient {
  @apply text-white !bg-primary;
}
.button--gradient {
  @apply overflow-hidden bg-gradient-to-r from-primary to-indigo-600 before:content-[""] before:absolute before:w-full before:h-full before:pointer-events-none before:transition-all before:duration-[0.4s] before:ease-[ease] before:z-[-1] before:hue-rotate-[-40deg] before:box-border before:rounded-[inherit] before:left-0 before:top-0 hover:(translate-y-[-3px] shadow-[0_10px_20px_-10px] shadow-primary before:opacity-0);
}
.button--gradient.button--primary:before,
.button--gradient.button--success:before {
  @apply hue-rotate-[40deg];
}
.button--gradient:before {
  background: linear-gradient(
    30deg,
    rgba(var(--color), 0) 33%,
    rgba(var(--color), 1)
  );
  -webkit-transition: all 0.4s ease;
  -webkit-filter: hue-rotate(-40deg);
  -webkit-box-sizing: border-box;
}

.button--gradient.button--active {
  @apply translate-y-[-3px] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.35)];
}
.button--relief {
  @apply text-white bg-primary overflow-hidden translate-x-0 scale-100 before:(content-[""] absolute w-full h-[calc(100%_-_3px)] pointer-events-none transition-all duration-[0.4s] ease-[ease] z-[-1] contrast-200 grayscale-[0.4] border-b-primary-600 box-border rounded-[inherit] border-b-[3px] border-solid left-0 bottom-0) active:translate-y-px active:before:border-b-primary-600 active:before:border-b-0 active:before:border-solid;
}
.button--relief .button__content {
  @apply transition-all duration-[0.25s] ease-[ease];
}
.button--relief.button--icon.button--active {
  @apply h-auto;
}
.button--relief:before {
  -webkit-transition: all 0.4s ease;
  -webkit-filter: contrast(2) grayscale(0.4);
  -webkit-box-sizing: border-box;
}
.button--relief:active {
  -webkit-transform: translateY(1px);
}
.button--relief:active .button__content {
  @apply pb-1.5;
}
.button--relief.button--active {
  @apply translate-y-px before:border-b-[rgba(var(--color),1)] before:border-b-0 before:border-solid;
}
.button--relief.button--active .button__content {
  @apply pb-1.5;
}
.button--transparent {
  @apply bg-transparent text-[rgba(var(--color),1)] overflow-hidden before:content-[""] before:absolute before:w-full before:h-full before:pointer-events-none before:transition-all before:duration-[0.25s] before:ease-[ease] before:z-[-1] before:opacity-0 before:box-border before:rounded-[inherit] before:scale-50 before:left-0 before:bottom-0;
}
.button--transparent:before {
  @apply bg-primary bg-opacity-10
}
.button--transparent:active:not(.button--active):before {
  @apply scale-90;
}
.button--transparent.button--active:before,
.button--transparent:hover:before {
  @apply opacity-100 scale-100;
}
.button--transparent.button--active:before {
  @apply bg-primary bg-opacity-20
}
.button--shadow {
  @apply bg-white text-[rgba(var(--text),1)] overflow-hidden shadow-[0_0_0_0];
}
.button--shadow:active:not(.button--active) {
  @apply -translate-y-px shadow-[0_5px_15px_0];
}
.button--shadow.button--active,
.button--shadow:hover {
  @apply translate-y-[-3px] shadow-[0_8px_25px_0];
}
.button-group {
  @apply flex items-center justify-center;
}
.button-group .button {
  @apply m-0 last-of-type:rounded-[0_12px_12px_0] first-of-type:rounded-[12px_0_0_12px];
}
.button-group .button:not(:last-of-type):not(:first-of-type) {
  @apply rounded-none border-0;
}
.button-group
  .button:not(:last-of-type):not(:first-of-type).button--border:before {
  @apply w-full border-l-0;
}
.button-group
  .button:not(:last-of-type):not(:first-of-type).button--border
  + .button--border:not(:last-of-type):before {
  @apply w-full border-r-0;
}
.ripple-content {
  @apply w-[100px] h-[100px] absolute w-full pointer-events-none overflow-hidden h-full z-[-1] rounded-[inherit] right-0 top-0;
}
.ripple-content .ripple {
  @apply w-0 h-0 opacity-0 absolute -translate-x-2/4 -translate-y-2/4 transition-all duration-[0.5s] ease-[ease] rounded-[50%];
  background: radial-gradient(
    circle,
    rgba(var(--color), 0.05),
    rgba(var(--color), 0.6)
  );
}
.ripple-content .ripple--solid {
  @apply opacity-100;
  background: rgba(var(--color), 1);
}
.ripple-content .ripple-invert {
  @apply w-0 h-0 opacity-0 absolute -translate-x-2/4 -translate-y-2/4 transition-all duration-[0.5s] ease-[ease] bg-[radial-gradient(circle,rgba(var(--color),0.5),rgba(var(--color),0))] rounded-[50%];
}
.ripple-content .ripple-cut-1 {
  @apply -translate-x-full -translate-y-2/4 skew-x-[20deg] bg-[-webkit-gradient(linear,right_top,left_top,from(hsla(0,0%,100%,0.25)),to(hsla(0,0%,100%,0)))] bg-[linear-gradient(270deg,hsla(0,0%,100%,0.25),hsla(0,0%,100%,0))];
}
.ripple-content .ripple-cut-1,
.ripple-content .ripple-cut-2 {
  @apply w-0 h-0 opacity-0 absolute transition-all duration-[0.6s] ease-[ease];
}
.ripple-content .ripple-cut-2 {
  @apply -translate-y-2/4 skew-x-[20deg] bg-[-webkit-gradient(linear,left_top,right_top,from(hsla(0,0%,100%,0.25)),to(hsla(0,0%,100%,0)))];
}
    

@keyframes btnload {
    0% {
        transform: rotate(0deg)
    }

    to {
        transform: rotate(1turn)
    }
}


@keyframes btnupload {
    0% {
        transform: translateY(110%)
    }

    to {
        transform: translateY(-110%)
    }
}
</style>