"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CommandPalette } from "@/components/layout/command-palette";

export function LayoutClient({ children }: { children: React.ReactNode }) {
	const [searchOpen, setSearchOpen] = useState(false);

	return (
		<div className="flex flex-col min-h-screen">
			<Header onOpenSearch={() => setSearchOpen(true)} />
			<main
				id="main-content"
				role="main"
				className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
			>
				{children}
			</main>
			<Footer />
			<CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
		</div>
	);
}
