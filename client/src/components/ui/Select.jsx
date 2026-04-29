import { forwardRef } from 'react';
import { cn } from '../../lib/utils.js';

export const Select = forwardRef(({ className, error, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring',
      error && 'border-destructive focus-visible:ring-destructive',
      className
    )}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = 'Select';
