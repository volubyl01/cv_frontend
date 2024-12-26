"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

// Export du Root
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;



// Export de DialogHeader
export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ''}`}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";



// Export de DialogDescription
export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={className}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// Export des autres composants Dialog
export const DialogContent = DialogPrimitive.Content;
export const DialogTitle = DialogPrimitive.Title;
export const DialogOverlay = DialogPrimitive.Overlay;
export const DialogClose = DialogPrimitive.Close;
