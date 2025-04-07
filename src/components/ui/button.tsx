import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from 'src/lib/utils'
import { PropsWithChildren } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-[8px] text-sm font-normal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white shadow hover:bg-primary-600 hover:text-white border-none',
        secondary: 'bg-secondary-500 text-secondary-100 shadow hover:bg-secondary/90',
        neutral: 'bg-neutral-100 text-neutral-500 shadow-sm hover:bg-neutral-500/80',
        outline:
          'border border-primary-400 bg-transparent shadow-sm hover:bg-primary-100 text-primary-500 hover:text-primary-400',
        error: 'bg-error-500 text-white shadow-sm hover:bg-error-600',
        ghost: ' hover:text-inherit border-none  text-inherit',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'p-[15px]',
        sm: 'p-[10px] rounded-md text-xs',
        xs: 'px-0.5 rounded-md text-xs',
        lg: 'p-[17px] rounded-md ',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
