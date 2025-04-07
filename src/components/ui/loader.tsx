import React from 'react'
import * as SolarIconSet from 'solar-icon-set'

export type LoaderType = 'spinner' | 'dots' | 'pulse'

export interface LoaderProps {
  /**
   * The type of loader to display
   * @default 'spinner'
   */
  type?: LoaderType
  /**
   * The size of the loader in pixels
   * @default 18
   */
  size?: number
  /**
   * The color of the loader
   * @default 'currentColor'
   */
  color?: string
  /**
   * Additional CSS classes to apply to the loader
   */
  className?: string
}

/**
 * A versatile loader component that can be used inline in buttons, text, etc.
 */
export const Loader: React.FC<LoaderProps> = ({
  type = 'spinner',
  size = 18,
  color = 'currentColor',
  className = '',
}) => {
  // Render different loader types
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={`flex items-center gap-1 ${className}`}>
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" style={{ animationDelay: '0ms' }} />
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" style={{ animationDelay: '150ms' }} />
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" style={{ animationDelay: '300ms' }} />
          </div>
        )
      case 'pulse':
        return (
          <div className={`relative h-4 w-4 ${className}`}>
            <div className="absolute h-full w-full animate-ping rounded-full bg-current opacity-75" />
            <div className="relative h-full w-full rounded-full bg-current" />
          </div>
        )
      case 'spinner':
      default:
        return (
          <SolarIconSet.Refresh size={size} color={color} iconStyle="Outline" className={`animate-spin ${className}`} />
        )
    }
  }

  return renderLoader()
}
