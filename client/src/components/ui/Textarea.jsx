import { forwardRef } from 'react';
import { cn } from '../../lib/utils.js';

export const Textarea = forwardRef(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring',
      error && 'border-destructive focus-visible:ring-destructive',
      className
    )}
    {...props}
  />
));

Textarea.displayName = 'Textarea';
