"use client";

export function HeroBackground() {
	return (
		<div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
			{/* Base grid pattern */}
			<div className="absolute inset-0 geometric-grid opacity-50" />

			{/* Static gradient orbs - no animation for performance */}
			<div className="absolute inset-0">
				{/* Purple orb - top right */}
				<div className="absolute -top-20 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-accent-purple/20 to-transparent blur-3xl" />

				{/* Pink orb - bottom left */}
				<div className="absolute -bottom-20 left-0 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-accent-pink/15 to-transparent blur-3xl" />

				{/* Center orb for fullscreen coverage */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-accent-purple/5 via-transparent to-accent-pink/5 blur-3xl" />
			</div>

			{/* Simplified geometric accents */}
			<svg
				className="absolute inset-0 w-full h-full opacity-30"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.15" />
						<stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0.15" />
					</linearGradient>
				</defs>

				{/* Simple decorative shapes - no animation */}
				<polygon
					points="100,20 140,45 140,95 100,120 60,95 60,45"
					fill="url(#grad1)"
				/>
				<circle
					cx="80%"
					cy="60%"
					r="60"
					fill="none"
					stroke="url(#grad1)"
					strokeWidth="1"
				/>
				<circle
					cx="15%"
					cy="50%"
					r="80"
					fill="none"
					stroke="url(#grad1)"
					strokeWidth="1"
					strokeDasharray="4 8"
				/>
			</svg>
		</div>
	);
}
