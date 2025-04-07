import * as React from 'react'

import { cn } from 'src/lib/utils'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'bg-background ring-offset-background flex min-h-[80px] w-full rounded-md border border-neutral-200 px-3 py-2 text-base font-light text-neutral-400 placeholder:text-neutral-400 hover:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
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
