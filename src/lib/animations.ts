import { type Variants } from "framer-motion";

// Page transition variants
export const pageVariants: Variants = {
	initial: {
		opacity: 0,
		y: 20,
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.4,
			ease: [0.25, 0.4, 0.25, 1],
		},
	},
	exit: {
		opacity: 0,
		y: -10,
		transition: {
			duration: 0.3,
			ease: [0.25, 0.4, 0.25, 1],
		},
	},
};

// Stagger container for lists/grids
export const staggerContainer: Variants = {
	initial: {},
	animate: {
		transition: {
			staggerChildren: 0.05,
			delayChildren: 0.1,
		},
	},
};

// Individual item in stagger
export const staggerItem: Variants = {
	initial: {
		opacity: 0,
		y: 20,
		scale: 0.95,
	},
	animate: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.4,
			ease: [0.25, 0.4, 0.25, 1],
		},
	},
};

// Fade in animation
export const fadeIn: Variants = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
		transition: {
			duration: 0.4,
			ease: "easeOut",
		},
	},
};

// Scale up animation (for buttons, cards)
export const scaleUp: Variants = {
	initial: {
		scale: 0.95,
		opacity: 0,
	},
	animate: {
		scale: 1,
		opacity: 1,
		transition: {
			duration: 0.3,
			ease: [0.25, 0.4, 0.25, 1],
		},
	},
};

// Slide in from left
export const slideInLeft: Variants = {
	initial: {
		x: -20,
		opacity: 0,
	},
	animate: {
		x: 0,
		opacity: 1,
		transition: {
			duration: 0.4,
			ease: [0.25, 0.4, 0.25, 1],
		},
	},
};

// Slide in from right
export const slideInRight: Variants = {
	initial: {
		x: 20,
		opacity: 0,
	},
	animate: {
		x: 0,
		opacity: 1,
		transition: {
			duration: 0.4,
			ease: [0.25, 0.4, 0.25, 1],
		},
	},
};

// Hero text animation (word by word)
export const heroTextContainer: Variants = {
	initial: {},
	animate: {
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.2,
		},
	},
};

export const heroTextWord: Variants = {
	initial: {
		opacity: 0,
		y: 30,
		rotateX: -40,
	},
	animate: {
		opacity: 1,
		y: 0,
		rotateX: 0,
		transition: {
			duration: 0.6,
			ease: [0.25, 0.4, 0.25, 1],
		},
	},
};

// Floating animation for geometric shapes
export const float: Variants = {
	initial: {
		y: 0,
	},
	animate: {
		y: [-10, 10, -10],
		transition: {
			duration: 6,
			repeat: Infinity,
			ease: "easeInOut",
		},
	},
};

// Pulse glow animation
export const pulseGlow: Variants = {
	initial: {
		opacity: 0.3,
		scale: 1,
	},
	animate: {
		opacity: [0.3, 0.6, 0.3],
		scale: [1, 1.05, 1],
		transition: {
			duration: 4,
			repeat: Infinity,
			ease: "easeInOut",
		},
	},
};

// Button press animation
export const buttonPress = {
	whileTap: { scale: 0.97 },
	whileHover: { scale: 1.02 },
	transition: { type: "spring", stiffness: 400, damping: 17 },
};

// Card hover animation
export const cardHover = {
	whileHover: {
		y: -4,
		transition: { duration: 0.2, ease: "easeOut" },
	},
};

// Result reveal animation
export const resultReveal: Variants = {
	initial: {
		opacity: 0,
		y: 10,
		height: 0,
	},
	animate: {
		opacity: 1,
		y: 0,
		height: "auto",
		transition: {
			duration: 0.3,
			ease: [0.25, 0.4, 0.25, 1],
		},
	},
	exit: {
		opacity: 0,
		y: -10,
		height: 0,
		transition: {
			duration: 0.2,
		},
	},
};

// Command palette animation
export const commandPaletteVariants: Variants = {
	initial: {
		opacity: 0,
		scale: 0.95,
	},
	animate: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.15,
			ease: "easeOut",
		},
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: {
			duration: 0.1,
			ease: "easeIn",
		},
	},
};

// Backdrop animation
export const backdropVariants: Variants = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
		transition: {
			duration: 0.15,
		},
	},
	exit: {
		opacity: 0,
		transition: {
			duration: 0.1,
		},
	},
};
