export type DialogType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'question'
  | 'confirm'
  | 'loading'

export type Theme = 'auto' | 'light' | 'dark'

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'month'
  | 'week'
  | 'datetime-local'
  | 'textarea'
  | 'select'

export type DismissReason =
  | 'cancel'
  | 'esc'
  | 'backdrop'
  | 'timer'
  | 'close'
  | 'replace'

export interface InputAttributes {
  min?: string | number
  max?: string | number
  step?: string | number
  autocomplete?: string
  autocapitalize?: string
  autocorrect?: string
  disabled?: boolean
  enterkeyhint?: string
  inputmode?: string
  list?: string
  maxlength?: string | number
  minlength?: string | number
  name?: string
  pattern?: string
  placeholder?: string
  readonly?: boolean
  required?: boolean
  size?: string | number
  spellcheck?: boolean | 'true' | 'false'
  tabindex?: string | number
  title?: string
  type?: Exclude<InputType, 'textarea' | 'select'>
  [name: string]: string | number | boolean | undefined
}

export interface Options {
  type?: DialogType
  title?: string
  text?: string
  html?: string
  confirmText?: string
  cancelText?: string
  showConfirm?: boolean
  showCancel?: boolean
  allowOutsideClick?: boolean
  allowEscapeKey?: boolean
  timer?: number
  input?: InputType | ''
  inputPlaceholder?: string
  inputValue?: string
  inputLabel?: string
  inputOptions?: Record<string, string> | null
  inputValidator?: ((value: string) => string | false | void | null) | null
  inputAttributes?: InputAttributes | null
  theme?: Theme
  icon?: boolean
  backdrop?: boolean
}

export interface Result {
  isConfirmed: boolean
  isDismissed: boolean
  value: unknown
  dismiss?: DismissReason
}

export type Helper = (
  title?: string,
  text?: string,
  extra?: Options
) => Promise<Result>

export interface ModernAlertAPI {
  show(options?: Options): Promise<Result>
  show(title: string, text?: string, type?: DialogType): Promise<Result>
  close(): Promise<Result | void>
  isVisible(): boolean
  loading(title?: string, text?: string): Promise<Result>
  success: Helper
  error: Helper
  warning: Helper
  info: Helper
  question: Helper
  confirm: Helper
}

declare const ModernAlert: ModernAlertAPI

export as namespace ModernAlert
export { ModernAlert }
export default ModernAlert

declare global {
  interface Window {
    ModernAlert: ModernAlertAPI
    ModernAlertIcons?: Record<string, string>
  }

  const ModernAlert: ModernAlertAPI
}
