'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export function Rating({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  className,
}: RatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(value)
          const partial = i === Math.floor(value) && value % 1 > 0
          const percentage = partial ? (value % 1) * 100 : 0

          return (
            <div key={i} className="relative">
              <Star
                className={cn(
                  sizeClasses[size],
                  'text-muted-foreground/30'
                )}
              />
              {(filled || partial) && (
                <Star
                  className={cn(
                    sizeClasses[size],
                    'absolute inset-0 fill-yellow-400 text-yellow-400'
                  )}
                  style={partial ? { clipPath: `inset(0 ${100 - percentage}% 0 0)` } : undefined}
                />
              )}
            </div>
          )
        })}
      </div>
      {showValue && (
        <span className="ml-1 text-sm font-semibold text-foreground">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  )
}




