import * as React from 'react'

import { cn } from 'src/lib/utils'
export type InputState = 'default' | 'error' | 'success' | 'disabled'
export type InputTone = 'filled' | 'outline'
export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * The state of the input
   * @default 'default'
   */
  state?: InputState
  /**
   * The tone of the input
   * @default 'outline'
   */
  tone?: InputTone
}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ disabled, state = 'default', tone = 'outline', className, ...props }, ref) => {
    // Determine if the input is disabled based on state or disabled prop
    const isDisabled = state === 'disabled' || disabled

    // Base styles for the input
    const baseStyles = 'border flex h-[80px] w-full rounded-md px-3 py-2 font-light text-base md:text-sm'

    // State-specific styles
    const stateStyles = {
      default: {
        border: 'border-neutral-200',
        background: 'bg-white',
        text: 'text-neutral-900',
        placeholder: 'placeholder:text-neutral-400',
        focus: 'focus-visible:ring-primary-500 focus-visible:border-primary-500',
        hover: 'hover:border-primary-300',
      },
      error: {
        border: 'border-error-500',
        background: 'bg-white',
        text: 'text-error-500',
        placeholder: 'placeholder:text-neutral-400',
        focus: 'focus-visible:ring-error-500 focus-visible:border-error-500',
        hover: 'hover:border-error-400',
      },
      success: {
        border: 'border-success-500',
        background: 'bg-white',
        text: 'text-neutral-900',
        placeholder: 'placeholder:text-neutral-400',
        focus: 'focus-visible:ring-success-500 focus-visible:border-success-500',
        hover: 'hover:border-success-400',
      },
      disabled: {
        border: 'border-neutral-200',
        background: 'bg-neutral-100',
        text: 'text-neutral-400',
        placeholder: 'placeholder:text-neutral-400',
        focus: '',
        hover: '',
      },
    }

    // Tone-specific styles
    const toneStyles = {
      outline: 'border',
      filled: 'border-0 bg-neutral-100',
    }

    // Focus styles (base only, state-specific focus styles are in stateStyles)
    const focusStyles = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

    // File input styles
    const fileStyles = 'file:border-0 file:bg-transparent file:text-sm file:font-medium'

    // Disabled styles
    const disabledStyles = isDisabled ? 'disabled:cursor-not-allowed disabled:opacity-50' : ''

    const currentStateStyles = stateStyles[state]
    return (
      <textarea
        className={cn(
          baseStyles,
          currentStateStyles.border,
          currentStateStyles.background,
          currentStateStyles.text,
          currentStateStyles.placeholder,
          toneStyles[tone],
          focusStyles,
          currentStateStyles.focus,
          !isDisabled && currentStateStyles.hover,
          fileStyles,
          disabledStyles,
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
