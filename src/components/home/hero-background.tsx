"use client";

import { motion } from "framer-motion";

export function HeroBackground() {
	return (
		<div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
			{/* Base grid pattern */}
			<div className="absolute inset-0 geometric-grid opacity-50" />

			{/* Gradient orbs */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1 }}
				className="absolute inset-0"
			>
				{/* Purple orb - top right */}
				<motion.div
					animate={{
						y: [0, -30, 0],
						x: [0, 20, 0],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className="absolute -top-20 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-accent-purple/25 to-transparent blur-3xl"
				/>

				{/* Pink orb - bottom left */}
				<motion.div
					animate={{
						y: [0, 30, 0],
						x: [0, -20, 0],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className="absolute -bottom-20 left-0 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-accent-pink/20 to-transparent blur-3xl"
				/>

				{/* Center orb for fullscreen coverage */}
				<motion.div
					animate={{
						scale: [1, 1.1, 1],
					}}
					transition={{
						duration: 12,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-accent-purple/10 via-transparent to-accent-pink/10 blur-3xl"
				/>
			</motion.div>

			{/* Geometric shapes */}
			<svg
				className="absolute inset-0 w-full h-full"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.1" />
						<stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0.1" />
					</linearGradient>
					<linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity="0.08" />
						<stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.08" />
					</linearGradient>
				</defs>

				{/* Floating hexagon - top left */}
				<motion.g
					animate={{
						y: [0, -15, 0],
						rotate: [0, 5, 0],
					}}
					transition={{
						duration: 12,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				>
					<polygon
						points="100,20 140,45 140,95 100,120 60,95 60,45"
						fill="url(#grad1)"
						stroke="url(#grad1)"
						strokeWidth="1"
					/>
				</motion.g>

				{/* Floating triangle - right side */}
				<motion.g
					animate={{
						y: [0, 20, 0],
						rotate: [0, -10, 0],
					}}
					transition={{
						duration: 15,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				>
					<polygon
						points="85%,30% 92%,50% 78%,50%"
						fill="url(#grad2)"
						stroke="url(#grad2)"
						strokeWidth="1"
					/>
				</motion.g>

				{/* Circle - center right */}
				<motion.circle
					cx="80%"
					cy="60%"
					r="60"
					fill="none"
					stroke="url(#grad1)"
					strokeWidth="1"
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				{/* Small square - bottom right */}
				<motion.rect
					x="70%"
					y="75%"
					width="40"
					height="40"
					fill="url(#grad2)"
					animate={{
						rotate: [0, 90, 0],
						y: [0, -10, 0],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					style={{ transformOrigin: "75% 80%" }}
				/>

				{/* Dotted circle - left side */}
				<motion.circle
					cx="15%"
					cy="50%"
					r="80"
					fill="none"
					stroke="url(#grad1)"
					strokeWidth="1"
					strokeDasharray="4 8"
					animate={{
						rotate: [0, 360],
					}}
					transition={{
						duration: 60,
						repeat: Infinity,
						ease: "linear",
					}}
					style={{ transformOrigin: "15% 50%" }}
				/>

				{/* Cross lines */}
				<motion.g
					animate={{
						opacity: [0.2, 0.4, 0.2],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				>
					<line
						x1="25%"
						y1="70%"
						x2="35%"
						y2="70%"
						stroke="url(#grad1)"
						strokeWidth="1"
					/>
					<line
						x1="30%"
						y1="65%"
						x2="30%"
						y2="75%"
						stroke="url(#grad1)"
						strokeWidth="1"
					/>
				</motion.g>

				{/* Small dots pattern */}
				{[...Array(5)].map((_, i) => (
					<motion.circle
						key={i}
						cx={`${60 + i * 5}%`}
						cy="20%"
						r="2"
						fill="url(#grad1)"
						animate={{
							opacity: [0.2, 0.5, 0.2],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut",
							delay: i * 0.2,
						}}
					/>
				))}
			</svg>


		</div>
	);
}
