import React, { forwardRef } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '../lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-teal-700 text-white hover:bg-teal-800',
        secondary: 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
        destructive: 'bg-rose-600 text-white hover:bg-rose-700',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
});

export function Select({ className, ...props }) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }) {
  return <section className={cn('rounded-lg border border-slate-200 bg-white shadow-sm', className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('flex items-start justify-between gap-4 border-b border-slate-100 p-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-base font-bold text-slate-950', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-4', className)} {...props} />;
}

export function Badge({ className, tone = 'slate', ...props }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700',
    teal: 'bg-teal-50 text-teal-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
    sky: 'bg-sky-50 text-sky-700',
  };

  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-bold', tones[tone], className)} {...props} />;
}

export function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <span className="text-sm font-medium text-slate-500">{label}</span>
          <strong className="text-2xl font-bold text-slate-950">{value}</strong>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-md bg-teal-50 text-teal-700">
          <Icon size={21} />
        </div>
      </div>
      {detail ? <p className="mt-3 text-xs text-slate-500">{detail}</p> : null}
    </Card>
  );
}
