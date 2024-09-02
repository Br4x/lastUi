<template>
  <div :class="['select-content mt-2', { block }]">
    <div class="select" ref="select" :class="[
    `select--state-${state}`,
    { 'select--disabled': disabled, activeOptions, loading }
  ]" @mouseleave="handleMouseLeave" @mouseenter="handleMouseEnter" @click="toggleOptions">
      <button @blur="blur">
        <input v-if="!multiple" :readonly="!filter" :id="!multiple ? _uid : ''" class="select__input text-sm"
          ref="input" :value="activeFilter ? textFilter : valueLabel"
          :class="{ multiple, simple: !multiple && !filter }" @keydown="handleKeydown" @focus="handleFocus"
          @input="handleInput" @blur="blur" />
      </button>

      <label v-if="!multiple || label" class="select__label" :for="_uid" :class="{
    'select__label--placeholder': labelPlaceholder,
    'select__label--label': label,
    'select__label--hidden': modelValue,
  }">
        {{ labelPlaceholder || label }}
      </label>

      <label v-if="!multiple && !labelPlaceholder" class="select__label" ref="placeholder" :for="_uid"
        :class="{ 'select__label--hidden': modelValue || textFilter }">
        {{ placeholder }}
      </label>

      <button v-if="multiple" class="select__chips" ref="chipsRef" @keydown="handleKeydown" @focus="handleFocusChips"
        @blur="blur">
        <span v-for="chip in chips" class="select__chips__chip" :data-value="chip.value"
          :class="{ isCollapse: chip.isCollapse }">
          {{ chip.label }}
          <span v-if="!chip.isCollapse" class="select__chips__chip__close" @click="clickChipClose(chip)"
            @mouseenter="targetClose = true" @mouseleave="targetClose = false">
            <i class="i-mynaui-x icon-close" />
          </span>
        </span>
        <input v-if="filter" class="select__chips__input" ref="chips_input" :placeholder="placeholder" :id="_uid"
          :value="textFilter" @focus="handleFocus" @blur="blur" @input="handleInput" />
      </button>

      <transition name="select">
        <div v-if="activeOptions" class="select__options component--primary" ref="optionsRef" :key="textFilter"
          @mouseleave="targetSelect = false; targetSelectInput = false"
          @mouseenter="targetSelect = true; targetSelectInput = true">
          <div class="select__options__content" ref="content">
            <div v-if="!options" class="select__options__content__not-data">
              <slot name="notData">No data available</slot>
            </div>
            <template v-if="isArray(options)">
              <SelectOption v-for="option in filteredOptions" :is-multiple="multiple" :option="option"
                :is-active="isActive(option)" @clicked="clickOption" />
            </template>
            <template v-else>
              <SelectOptionGroup v-for="options, label in filteredOptions" :label="label" :text-filter="textFilter">
                <SelectOption v-for="option in options" :is-multiple="multiple" :option="option"
                  :is-active="isActive(option)" @clicked="clickOption" />
              </SelectOptionGroup>
            </template>
          </div>
        </div>
      </transition>

      <div v-if="loading" class="select__loading" />

      <i class="i-mynaui-chevron-down icon-arrow" />
    </div>
    <transition name="select__message">
      <div v-if="hint" class="select__message" :class="hintClass">
        {{ hint }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { SelectOption, SelectOptionGroup } from '@/types/Select';
import { forEach, isArray } from 'lodash';

const props = defineProps({
  modelValue: { type: [String, Number, Array<number>, Array<string>], required: true },
  multiple: { type: Boolean, default: false },
  filter: { type: Boolean, default: true },
  placeholder: { type: String, default: '' },
  labelPlaceholder: { type: String, default: '' },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  collapseChips: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  state: { type: String, default: null },
  block: { type: Boolean, default: false },
  options: { type: Array as PropType<SelectOption[]> | Object as PropType<SelectOptionGroup>, default: [] },
  hint: String,
  hintClass: String,
})

const chips_input = ref()
const renderSelect = ref(false)
const activeOptions = ref(false)
const valueLabel = ref('')
const hoverOption = ref(-1)
const uids = ref([])
const targetSelect = ref(false)
const targetSelectInput = ref(false)
const targetClose = ref(false)
const activeFilter = ref(false)
const textFilter = ref('')
const _uid = ref('')
const optionsRef = ref()
const select = ref()
const chipsRef = ref()
const input = ref()

const emit = defineEmits(['update:modelValue', 'focus'])

const filteredOptions = computed(() => {
  if (Array.isArray(props.options)) {
    if (textFilter.value) {
      return props.options.filter(opt => opt.label.toLowerCase().indexOf(textFilter.value.toLowerCase()) !== -1)
    }
    return props.options
  } else {
    if (textFilter.value) {
      const map = {} as SelectOptionGroup
      forEach(props.options, (options, label) => {
        map[label] = options.filter(opt => opt.label.toLowerCase().indexOf(textFilter.value.toLowerCase()) !== -1)
      })
    }
    return props.options
  }

})

watch(() => textFilter.value, () => {
  setHover()
  insertOptions()
})

function insertOptions() {
  const target = document.querySelector('#__nuxt') ? document.querySelector('#__nuxt') : document.body
  target?.insertBefore(optionsRef.value, target.lastChild)
  setCords(optionsRef.value, select.value)
}

function clickOption(option: SelectOption) {
  if (props.multiple && Array.isArray(props.modelValue)) {
    const oldVal = [...props.modelValue]
    if (oldVal.indexOf(option.value) == -1) {
      oldVal.push(option.value)
    } else {
      oldVal.splice(oldVal.indexOf(option.value), 1)
    }
    emit('update:modelValue', oldVal)
    textFilter.value = ''
  } else {
    emit('update:modelValue', option.value)
    valueLabel.value = option.label
    activeFilter.value = false
    textFilter.value = ''

  }
  setTimeout(() => {
    if (props.multiple && activeOptions.value) {
      chipsRef.value.focus()
    }
  }, 10)
  if (!props.multiple) {
    handleBlur()
  }
}

const chips = computed(() => {
  const chips: any[] = []
  if (props.multiple && Array.isArray(props.modelValue)) {
    props.modelValue.forEach((item: any) => {
      if (Array.isArray(props.options)) {
        const option = props.options.find(opt => opt.value === item)
        chips.push(option)
      } else {
        let option;
        forEach(props.options, options => {
          const exist = options.find(opt => opt.value === item)
          if (exist) option = exist
        })
        if (option) chips.push(option)
      }
    })
    if (props.collapseChips && chips.length > 1) {
      return [
        { label: `${chips.length} items selected`, value: chips.map(chip => chip.value), isCollapse: true },
      ]
    }
  }

  return chips
})

function clickChipClose(chip: { value: any; }) {
  const oldVal = [...props.modelValue]
  oldVal.splice(oldVal.indexOf(chip.value), 1)
  emit('update:modelValue', oldVal)
}

function setHover() {
  /*let index = -1
  props.options?.forEach((item, i) => {
    if (item.value == props.modelValue) {
      index = i
    }
  })
  hoverOption.value = index*/
}

function getValue() {
  let filterOptions;
  if (Array.isArray(props.options)) {
    filterOptions = props.options?.filter(option => {
      return props.modelValue == option.value
    })
  }

  const label = [] as string[]

  filterOptions?.forEach(item => {
    label.push(item.label)
  })

  label.sort()

  valueLabel.value = Array.isArray(label) ? label.join(', ') : label
}

function handleBlur() {
  nextTick(() => {
    activeOptions.value = false
  })
}

function handleInput(e: any) {
  textFilter.value = e.target.value
  activeFilter.value = true
}

function handleFocus() {
  targetSelectInput.value = true

}

function handleMouseLeave() {
  targetSelect.value = false
}

function handleMouseEnter() {
  targetSelect.value = true
}

function handleFocusChips() {
  activeOptions.value = true
  chips_input.value.focus()
}

function blur(evt: any) {
  if (!props.multiple) {
    if (!evt.relatedTarget) {
      handleBlur()
    }
  } else {
    if (!evt.relatedTarget) {
      handleBlur()
    } else if (
      !targetSelectInput || !targetSelect && !activeOptions
    ) {
      handleBlur()
    }
  }
  if (props.filter) {
    activeFilter.value = false
  }
}



function toggleOptions() {
  activeOptions.value = !activeOptions.value
  if (activeOptions.value) {
    nextTick(() => {
      setHover()
      insertOptions()
    })
  }
}

function handleKeydown(e: any) {
  /*const KEY = e.key.toUpperCase()
  if (KEY == 'ENTER' && hoverOption.value != -1) {
    clickOption(
      props.options[hoverOption.value]
    )
    e.preventDefault()
  }
  if (KEY == 'ARROWDOWN') {
    hoverOption.value++
    if (hoverOption.value == props.options?.length) {
      hoverOption.value = 0
    }
  }
  if (KEY == 'ARROWUP') {
    hoverOption.value--
    if (hoverOption.value == -1) {
      hoverOption.value = props.options?.length - 1
    }
  }*/
}

function isActive(option: SelectOption) {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(option.value)
  }

  return props.modelValue === option.value
}

onMounted(() => {
  renderSelect.value = true
  getValue()
})
</script>



<style>
.select {
  @apply relative flex items-center justify-center min-h-[38px] w-full;
}

.select--state-primary .icon-arrow:after,
.select--state-primary .icon-arrow:before {
  @apply bg-primary;
}

.select.loading {
  @apply pointer-events-none;
}

.select.loading :not(.select__loading):not(.select__label) {
  @apply opacity-60;
}

.select.loading .select__label {
  @apply pointer-events-none;
}

.select.top.activeOptions .select__chips,
.select.top.activeOptions .select__input {
  @apply !shadow-[0_-5px_25px_-4px] rounded-[0_0_12px_12px] shadow-black/15;
}

.select--disabled {
  @apply opacity-60 pointer-events-none;
}

.select--disabled label {
  @apply pointer-events-none;
}

.select .icon-arrow {
  @apply z-[600] absolute transition-all duration-[0.25s] ease-[ease] pointer-events-auto cursor-pointer -mt-0.5 right-[15px];
}

.select.activeOptions .icon-arrow {
  @apply rotate-180 -mt-0.5;
}

.select.activeOptions .select__input {
  @apply shadow-[0_5px_25px_-4px] shadow-black/15 -translate-y-1 !bg-white rounded-[12px_12px_0_0] border-2 border-solid border-transparent;
}

.select.activeOptions .select__chips,
.select.activeOptions .select__input {
  @apply shadow-[0_5px_25px_-4px] -translate-y-1 transition-all duration-[0.25s] ease-[ease] delay-[0s];
}

.select.activeOptions .select__chips {
  @apply rounded-[12px_12px_0_0] after:opacity-0;
}

.select.activeOptions .select__label--placeholder {
  @apply opacity-100 visible pointer-events-auto !translate-x-[-3%] !-translate-y-7 text-xs mt-0;
}

.select.activeOptions .select__label {
  @apply -mt-1;
}

.select__input {
  @apply bg-gray-100 outline-none opacity-100 cursor-pointer transition-all duration-[0.25s] ease-[ease] delay-[0s] text-gray-800 min-h-[38px] w-full pl-[13px] pr-[30px] py-[7px] rounded-xl border-2 border-solid border-transparent focus:(shadow-[0_5px_25px_-4px] shadow-black/5 -translate-y-1 transition-all duration-[0.25s] ease-[ease] rounded-[12px_12px_0_0]) hover:(shadow-[0_5px_25px_-4px] shadow-black/15 -translate-y-1 !bg-white);

}

.select__input.multiple {
  @apply text-transparent pointer-events-none;
  background: transparent;
}

.select__input.simple {
  @apply select-none;
}


.select__input:focus~.select__label--placeholder {
  @apply opacity-100 visible pointer-events-auto translate-x-[-3%] -translate-y-7 text-xs mt-0;
}


.select__input:hover~.select__label {
  @apply -mt-1;
}

.select__input:hover~.icon-arrow {
  @apply -mt-1.5;
}

.select__chips {
  @apply bg-gray-100 w-full h-auto z-[300] flex items-start justify-start flex-wrap min-h-[38px] transition-all duration-[0.25s] ease-[ease, height] delay-[0s] pl-[5px] pr-[26px] py-[5px] rounded-xl border-0 left-0 focus:rounded-[12px_12px_0_0];
}

.select__chips:focus,
.select__chips:hover {
  @apply bg-white shadow-[0_5px_25px_-4px] shadow-black/15 -translate-y-1 transition-all duration-[0.25s] ease-[ease];

}

.select__chips:hover~.icon-arrow {
  @apply transition-all duration-[0.25s] ease-[ease] -mt-1.5;
}

.select__chips__input {
  @apply bg-transparent outline-none w-auto flex-1 max-w-full relative min-w-0 min-w-[30px] mx-[3px] my-0.5 border-0 border-solid border-transparent;
}

.select__chips__input::placeholder {
  @apply text-gray-800/40;
}

.select__chips__chip {
  @apply bg-white flex-initial relative flex items-center justify-center text-[0.84rem] border-gray-100 box-border text-[rgba(var(--text), 1)] mx-[3px] my-0.5 pl-1.5 pr-2.5 py-0 rounded-[10px] border-2 border-solid;

}

.select__chips__chip.isCollapse {
  @apply pr-1.5;
}

.select__chips__chip__close {
  @apply bg-gray-300 absolute w-[15px] h-[15px] flex items-center justify-center text-xs cursor-pointer transition-all duration-[0.25s] ease-[ease] rounded-[50%] -right-1 -top-1 hover:( !bg-red);
}


.select__chips__chip__close:hover .icon-close {
  @apply rotate-45 bg-white
}

.select__chips__chip__close .icon-close {
  @apply text-gray-800 scale-80;
}

.select__options {
  @apply bg-white text-primary absolute z-[99999] overflow-hidden shadow-[0_10px_20px_-5px] shadow-black/15 p-[5px] rounded-[0_0_12px_12px] after:content-[""] after:absolute after:w-4/5 after:h-2.5 after:z-[200] after:transition-all after:duration-[0.25s] after:ease-[ease] after:delay-[0.05s] after:opacity-100 after:ml-[10%] after:left-0 after:-top-2.5;
}

.select__options.top {
  @apply shadow-[0_-10px_20px_-5px] rounded-[12px_12px_0_0] shadow-black/15 after:top-auto after:-bottom-2.5;
}

.select__options:after {
  @apply bg-white
}

.select__options__content {
  @apply max-h-[200px] overflow-auto h-auto z-[100] transition-all duration-[0.25s] ease-[ease] relative scroll-smooth scale-100;
}

.select__options__content__not-data {
  @apply text-[0.8rem] text-center px-2.5 py-1.5;
}

.select__options__content::-webkit-scrollbar {
  @apply w-[5px] h-[5px] block bg-transparent;
}

.select__options__content::-webkit-scrollbar-thumb {
  @apply rounded-[5px] bg-gray-300;
}

.select__label {
  @apply absolute text-[0.8rem] transition-all duration-[0.25s] ease-[ease] cursor-text select-none pointer-events-none w-full flex items-center justify-start opacity-40 z-[500] left-3.5 top-[10px];
}

.select__label--hidden {
  @apply opacity-0 invisible;
}

.select__label--hidden.select__label--placeholder,
.select__label--label {
  @apply opacity-100 visible pointer-events-auto translate-x-[-3%] -translate-y-7 text-xs mt-0;
}

.select__loading {
  @apply absolute w-[22px] h-[22px] pointer-events-none box-border cursor-default z-[600] rounded-[50%] right-[7px] after:border-primary after:animate-[rotateInputLoading_0.8s_ease_infinite] after:rounded-[inherit] after:border-t-transparent after:border-x-transparent after:border-2 after:border-solid before:border-[rgba(var(--primary), 1)] before:animate-[rotateInputLoading_0.8s_linear_infinite] before:opacity-20 before:rounded-[inherit] before:border-t-transparent before:border-x-transparent before:border-2 before:border-dashed before:border-solid;
  background: inherit;
}


.select__loading:after,
.select__loading:before {
  @apply box-border absolute w-full h-full content-[""] top-0;
}


.select__loading~.icon-arrow {
  @apply opacity-0;
}

.select__message {
  @apply text-[0.7rem] text-left relative transition-all duration-[0.25s] ease-[ease] overflow-hidden px-[7px] py-0;
}

.select__message--success {
  @apply text-[rgba(var(--success), 1)];
}

.select__message--danger {
  @apply text-[rgba(var(--danger), 1)];
}

.select__message--warn {
  @apply text-[rgba(var(--warn), 1)];
}

.select__message--dark {
  @apply text-[rgba(var(--dark), 1)];
}

.select__message--primary {
  @apply text-[rgba(var(--primary), 1)];
}

.dark .select__options.isColorDark .select__option:hover {
  @apply text-[rgba(var(--text), 1)];
  background: rgba(var(--color), 0.2);
}

.dark .select__options.isColorDark .activeOption {
  @apply text-[rgba(var(--text), 1)];
  background: rgba(var(--color), 0.6);
}

.select__option {
  @apply bg-transparent w-full text-left transition-all duration-[0.25s] ease-[ease] text-gray-800 shadow-[0_0_0_0] shadow-black/05 flex justify-start overflow-hidden opacity-100 visible max-h-10 mx-0 my-0.5 px-2.5 py-1.5 rounded-[5px] border-0;
}

.select__option.hiddenOption {
  @apply opacity-0 invisible max-h-0 m-0 py-0 border-0;
}

.select__option.isMultiple {
  @apply pl-[5px] pr-0 py-0 hover:pl-[5px];
}

.select__option.isMultiple .select__option-group {
  @apply pl-0;
}

.select__option.isMultiple.isHover {
  @apply !bg-gray-200
}

.select__option.isMultiple:disabled .checkbox-content {
  @apply pointer-events-none;
}

.select__option.isMultiple .checkbox-content {
  @apply w-full pointer-events-none;
}

.select__option.isMultiple .checkbox-content .checkbox-con {
  @apply scale-[0.85];
}

.select__option.isMultiple .checkbox-content .checkbox-label {
  @apply w-[calc(100%_-_23px)] text-left justify-start;
}

.select__option.isMultiple.activeOption {
  @apply pointer-events-auto;
}

.select__option.isHover {
  @apply bg-gray-200
}

.select__option.activeOption {
  @apply bg-primary bg-opacity-05 text-primary;
}

.select__option:hover:not(:disabled) {
  @apply text-primary pl-3.5;
}

.select__option:disabled {
  @apply !text-gray-300;
}

.select__option-group {
  @apply border-b-gray-100 relative overflow-hidden transition-all duration-[0.25s] ease-[ease] pl-2.5 border-b-2 border-solid last:border-0;
}

.select__option-group.hiddenOptionGroup {
  @apply border-b-gray-100 border-b-0 border-solid;
}

.select__option-group.hiddenOptionGroup h5 {
  @apply max-h-0 p-0;
}

.select__option-group h5 {
  @apply max-h-7 transition-all duration-[0.25s] ease-[ease] opacity-50 text-[0.7rem] select-none overflow-hidden m-0 px-0 py-[7px];
}

.select__option-group h5 * {
  @apply pointer-events-none;
}
</style>