import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from 'src/lib/utils'
import { motion } from 'framer-motion'

const Tabs = TabsPrimitive.Root

type TriggerMeta = { ref: React.RefObject<HTMLDivElement>; value: string }

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const [activeMeta, setActiveMeta] = React.useState<{ left: number; width: number } | null>(null)
  const [activeValue, setActiveValue] = React.useState<string | null>(null)
  const triggers = React.Children.toArray(children).filter(Boolean) as React.ReactElement[]

  // Collect refs for each trigger
  const triggerMetas = React.useMemo(
    () =>
      triggers.map((child) => ({
        ref: React.createRef<HTMLDivElement>(),
        value: child.props.value,
      })),
    [triggers.length],
  )

  // Find the active trigger and update indicator position
  React.useEffect(() => {
    if (!activeValue) return
    const meta = triggerMetas.find((m) => m.value === activeValue)
    if (meta?.ref.current) {
      const { offsetLeft: left, offsetWidth: width } = meta.ref.current
      setActiveMeta({ left, width })
    }
  }, [activeValue, triggerMetas])

  // Clone triggers to wrap in a div with a ref and set activeValue on focus/click
  const enhancedTriggers = triggers.map((child, idx) =>
    React.cloneElement(child, {
      ref: triggerMetas[idx].ref,
      onFocus: () => setActiveValue(child.props.value),
      onClick: () => setActiveValue(child.props.value),
      'data-value': child.props.value,
      ...child.props,
    }),
  )

  // Set initial active tab on mount
  React.useEffect(() => {
    const active = triggers.find((c) => c.props['data-state'] === 'active')
    if (active) setActiveValue(active.props.value)
  }, [triggers])

  return (
    <div className="relative w-full">
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          'bg-muted text-muted-foreground relative inline-flex h-12 items-center justify-center rounded-md',
          className,
        )}
        {...props}
      >
        {enhancedTriggers.map((trigger, idx) => (
          <div
            key={trigger.props.value}
            ref={triggerMetas[idx].ref}
            className="relative flex items-center justify-center"
            style={{ flex: 1 }}
          >
            {trigger}
          </div>
        ))}
        {activeMeta && (
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute bottom-0 h-1 rounded bg-primary-400"
            style={{
              left: activeMeta.left,
              width: activeMeta.width,
            }}
          />
        )}
      </TabsPrimitive.List>
    </div>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background inline-flex items-center justify-center whitespace-nowrap px-4 py-3 text-sm font-normal transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'ring-offset-background focus-visible:ring-ring mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
