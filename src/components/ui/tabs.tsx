"use client";

import { useState, createContext, useContext, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabsContextValue {
	activeTab: string;
	setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
	const context = useContext(TabsContext);
	if (!context) {
		throw new Error("Tabs components must be used within a Tabs provider");
	}
	return context;
}

interface TabsProps {
	defaultValue: string;
	children: ReactNode;
	className?: string;
	onValueChange?: (value: string) => void;
}

export function Tabs({ defaultValue, children, className, onValueChange }: TabsProps) {
	const [activeTab, setActiveTab] = useState(defaultValue);

	const handleSetActiveTab = (value: string) => {
		setActiveTab(value);
		onValueChange?.(value);
	};

	return (
		<TabsContext.Provider value={{ activeTab, setActiveTab: handleSetActiveTab }}>
			<div className={cn("w-full", className)}>{children}</div>
		</TabsContext.Provider>
	);
}

interface TabsListProps {
	children: ReactNode;
	className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
	return (
		<div
			className={cn(
				"inline-flex items-center gap-1 p-1 bg-background-secondary rounded-lg",
				className
			)}
		>
			{children}
		</div>
	);
}

interface TabsTriggerProps {
	value: string;
	children: ReactNode;
	className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
	const { activeTab, setActiveTab } = useTabsContext();
	const isActive = activeTab === value;

	return (
		<button
			onClick={() => setActiveTab(value)}
			className={cn(
				"relative px-4 py-2 text-sm font-medium rounded-md transition-colors",
				isActive
					? "text-foreground"
					: "text-foreground-muted hover:text-foreground",
				className
			)}
		>
			{isActive && (
				<motion.div
					layoutId="activeTab"
					className="absolute inset-0 bg-card rounded-md shadow-sm"
					transition={{ type: "spring", stiffness: 400, damping: 30 }}
				/>
			)}
			<span className="relative z-10">{children}</span>
		</button>
	);
}

interface TabsContentProps {
	value: string;
	children: ReactNode;
	className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
	const { activeTab } = useTabsContext();

	if (activeTab !== value) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
			className={cn("mt-4", className)}
		>
			{children}
		</motion.div>
	);
}
