import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from 'src/lib/utils'
import { PropsWithChildren } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-5 text-white shadow hover:bg-primary-5/90',
        secondary: 'bg-secondary text-secondary-1 shadow hover:bg-secondary/90',
        neutral: 'bg-neutral-500 text-neutral-500 shadow-sm hover:bg-neutral-500/80',
        outline: 'border border-neutral-300 bg-transparent shadow-sm hover:bg-neutral-300 hover:text-neutral-700',
        error: 'bg-error text-error shadow-sm hover:bg-error/90',
        ghost: 'hover:bg-neutral-200 hover:text-neutral-800',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
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
