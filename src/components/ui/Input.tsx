import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/helpers';

const inputVariants = cva(
    'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'border-gray-300 focus:border-blue-500',
                error: 'border-red-500 focus:border-red-500 focus-visible:ring-red-500',
                success: 'border-green-500 focus:border-green-500 focus-visible:ring-green-500',
            },
            inputSize: {
                default: 'h-10 px-3 py-2',
                sm: 'h-9 px-3 py-2 text-sm',
                lg: 'h-11 px-4 py-2',
            },
        },
        defaultVariants: {
            variant: 'default',
            inputSize: 'default',
        },
    }
);

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant, inputSize, label, error, helperText, id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        const finalVariant = error ? 'error' : variant;

        return (
            <div className="space-y-2">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {label}
                    </label>
                )}
                <input
                    id={inputId}
                    className={cn(inputVariants({ variant: finalVariant, inputSize, className }))}
                    ref={ref}
                    {...props}
                />
                {(error || helperText) && (
                    <p className={cn(
                        'text-sm',
                        error ? 'text-red-600' : 'text-gray-600'
                    )}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input, inputVariants };