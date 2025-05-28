import * as React from 'react'

import { cn } from 'src/lib/utils'

export type InputState = 'default' | 'error' | 'success' | 'disabled' | 'plain'
export type InputTone = 'filled' | 'outline'
export type IconPosition = 'left' | 'right' | 'both'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
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
  /**
   * Icon element to display
   */
  icon?: React.ReactNode
  /**
   * Position of the icon
   * @default 'left'
   */
  iconPosition?: IconPosition
  /**
   * Additional class name for the input container
   */
  containerClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      state = 'default',
      tone = 'outline',
      icon,
      iconPosition = 'left',
      containerClassName,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Determine if the input is disabled based on state or disabled prop
    const isDisabled = state === 'disabled' || disabled

    // Base styles for the input
    const baseStyles =
      'border flex h-10 w-full rounded-md font-clash px-3 py-2 font-normal text-base md:text-sm focus:outline-none '

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
      plain: {
        border: 'border-neutral-200',
        background: 'bg-white',
        text: 'text-neutral-900',
        placeholder: 'placeholder:text-neutral-400',
        focus: 'focus-visible:ring-primary-500 focus-visible:border-none',
        hover: 'hover:border-none',
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

    // Icon padding styles
    const getIconPaddingStyles = () => {
      if (!icon) return ''

      switch (iconPosition) {
        case 'left':
          return 'pl-9'
        case 'right':
          return 'pr-9'
        case 'both':
          return 'px-9'
        default:
          return ''
      }
    }

    // Get the current state styles
    const currentStateStyles = stateStyles[state]

    return (
      <div className={cn('relative flex items-center', containerClassName)}>
        {icon && (iconPosition === 'left' || iconPosition === 'both') && (
          <div className="absolute left-0 flex h-full w-9 items-center justify-center">{icon}</div>
        )}
        <input
          type={type}
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
            getIconPaddingStyles(),
            className,
          )}
          ref={ref}
          disabled={isDisabled}
          {...props}
        />
        {icon && (iconPosition === 'right' || iconPosition === 'both') && (
          <div className="absolute right-0 flex h-full w-9 items-center justify-center">{icon}</div>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
