import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from 'src/lib/utils'
import { PropsWithChildren } from 'react'

const anchorButtonVariants = cva(
  'inline-flex cursor-pointer w-full items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-12 px-4 py-4',
        sm: 'h-8 px-4 text-xs',
        lg: 'h-12 px-8 text-lg',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export interface AnchorButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof anchorButtonVariants> {
  asChild?: boolean
  active?: boolean
}

const AnchorButton = React.forwardRef<HTMLAnchorElement, PropsWithChildren<AnchorButtonProps>>(
  ({ className, size, asChild = false, active = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a'
    return (
      <Comp
        className={cn(
          anchorButtonVariants({ size, className }),
          active
            ? 'w-full border-2 border-primary-400 bg-none text-primary-600'
            : 'border-2 border-transparent bg-none hover:bg-primary-200',
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
AnchorButton.displayName = 'AnchorButton'

export { AnchorButton, anchorButtonVariants }
