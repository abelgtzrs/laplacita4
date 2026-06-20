import * as React from "react";

import { cn } from "@/lib/utils";

type CardVariant = "elevated" | "outline" | "subtle";

const variantClasses: Record<CardVariant, string> = {
  elevated:
    "bg-card/90 border-border/70 text-card-foreground shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur supports-[backdrop-filter]:backdrop-blur",
  outline:
    "bg-card border-border/80 text-card-foreground shadow-[0_6px_20px_rgba(0,0,0,0.04)]",
  subtle:
    "bg-gradient-to-b from-card/95 via-card to-card/85 border-border/60 text-card-foreground shadow-[0_12px_35px_rgba(0,0,0,0.06)]",
};

type CardProps = React.ComponentProps<"div"> & {
  variant?: CardVariant;
  interactive?: boolean;
};

function Card({
  className,
  variant = "elevated",
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "relative isolate flex flex-col gap-6 rounded-2xl border py-6 transition-all duration-200",
        variantClasses[variant],
        interactive &&
          "hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(0,0,0,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/70",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
