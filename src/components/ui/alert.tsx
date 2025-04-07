import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from 'src/lib/utils'
import * as SolarIconSet from 'solar-icon-set'

const alertVariants = cva(
  'relative w-full rounded-lg p-4 py-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        primary: 'text-primary-600 dark:text-primary-400',
        secondary: 'text-secondary-600 dark:text-secondary-400',
        success: 'text-success-600 dark:text-success-400',
        error: 'text-error-400 dark:text-error-400',
        warning: 'text-warning-600 dark:text-warning-400',
        info: 'text-info-600 dark:text-info-400',
      },
      tone: {
        filled: '',
        outline: 'border',
      },
    },
    compoundVariants: [
      // Primary variants
      {
        variant: 'primary',
        tone: 'filled',
        className: 'bg-primary-100 dark:bg-primary-900/20',
      },
      {
        variant: 'primary',
        tone: 'outline',
        className: 'border-primary-200 dark:border-primary-800',
      },
      // Secondary variants
      {
        variant: 'secondary',
        tone: 'filled',
        className: 'bg-secondary-100 dark:bg-secondary-900/20',
      },
      {
        variant: 'secondary',
        tone: 'outline',
        className: 'border-secondary-200 dark:border-secondary-800',
      },
      // Success variants
      {
        variant: 'success',
        tone: 'filled',
        className: 'bg-success-100 dark:bg-success-900/20',
      },
      {
        variant: 'success',
        tone: 'outline',
        className: 'border-success-200 dark:border-success-800',
      },
      // Error variants
      {
        variant: 'error',
        tone: 'filled',
        className: 'bg-error-100 dark:bg-error-900/20',
      },
      {
        variant: 'error',
        tone: 'outline',
        className: 'border-error-200 dark:border-error-800',
      },
      // Warning variants
      {
        variant: 'warning',
        tone: 'filled',
        className: 'bg-warning-100 dark:bg-warning-900/20',
      },
      {
        variant: 'warning',
        tone: 'outline',
        className: 'border-warning-200 dark:border-warning-800',
      },
      // Info variants
      {
        variant: 'info',
        tone: 'filled',
        className: 'bg-info-100 dark:bg-info-900/20',
      },
      {
        variant: 'info',
        tone: 'outline',
        className: 'border-info-200 dark:border-info-800',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      tone: 'filled',
    },
  },
)

const motionVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

const Alert = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'> & VariantProps<typeof alertVariants>>(
  ({ className, variant, tone, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)

    if (!isVisible) return null

    return (
      <motion.div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant, tone }), className)}
        variants={motionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        {...props}
      >
        <div className="grid grid-cols-12 items-start gap-2">
          <div className="col-span-1 pt-1">
            <SolarIconSet.InfoCircle color="currentColor" size={18} iconStyle="Bold" />
          </div>
          <div className="col-span-10">{children as React.ReactNode}</div>
          <div className="col-span-1 flex items-start justify-end">
            <button
              onClick={() => setIsVisible(false)}
              className="hover:bg-current/10 rounded-full p-1 transition-colors"
              aria-label="Close alert"
            >
              <SolarIconSet.CloseCircle color="currentColor" size={18} iconStyle="Outline" />
            </button>
          </div>
        </div>
      </motion.div>
    )
  },
)
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('text-pretty mb-1 text-xs font-semibold', className)} {...props} />
  ),
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-xs font-light [&_p]:leading-relaxed', className)} {...props} />
  ),
)
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
