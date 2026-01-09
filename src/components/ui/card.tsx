"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	hover?: boolean;
	gradient?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
	({ className, hover = true, gradient = false, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					"relative bg-card rounded-xl border border-border p-6",
					"transition-all duration-200",
					hover && "hover:shadow-lg hover:border-border-hover hover:-translate-y-0.5",
					gradient && "gradient-border",
					className
				)}
				{...props}
			>
				{children}
			</div>
		);
	}
);

Card.displayName = "Card";

// Card Header
type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn("flex flex-col space-y-1.5 pb-4", className)}
			{...props}
		/>
	)
);
CardHeader.displayName = "CardHeader";

// Card Title
type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
	({ className, ...props }, ref) => (
		<h3
			ref={ref}
			className={cn("font-mono text-lg font-semibold text-foreground", className)}
			{...props}
		/>
	)
);
CardTitle.displayName = "CardTitle";

// Card Description
type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
	({ className, ...props }, ref) => (
		<p
			ref={ref}
			className={cn("text-sm text-foreground-muted", className)}
			{...props}
		/>
	)
);
CardDescription.displayName = "CardDescription";

// Card Content
type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("", className)} {...props} />
	)
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
export type { CardHeaderProps, CardTitleProps, CardDescriptionProps, CardContentProps };
