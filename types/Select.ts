export interface SelectOption {
  label: string;
  value: number | string;
  disabled?: Boolean
}

export interface SelectOptionGroup {
  [key: string]: SelectOption[]
}