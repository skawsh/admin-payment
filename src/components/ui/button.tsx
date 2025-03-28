
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-600 text-white shadow-sm hover:bg-green-700", // Enhanced green variant
        back: "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-full shadow-sm", // Enhanced back button
        service: "bg-admin-primary text-white hover:bg-admin-primary/90 border border-admin-primary/20 shadow-sm",
        subservice: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-200 shadow-sm",
        item: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 shadow-sm",
        express: "bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200 shadow-sm", // Enhanced express variant
        edit: "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 shadow-sm", // Enhanced edit variant
        delete: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 shadow-sm", // Enhanced delete variant
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9 rounded-full", // Updated icon size for round back button
        xs: "h-7 text-xs px-2 py-1 rounded-md", // Added extra small size
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
