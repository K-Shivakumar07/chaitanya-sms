import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				display: ['Sora', 'sans-serif'],
				portal: ['Manrope', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				portal: {
					canvas: 'hsl(var(--portal-canvas))',
					ink: 'hsl(var(--portal-ink))',
					blue: 'hsl(var(--portal-blue))',
					'blue-strong': 'hsl(var(--portal-blue-strong))',
					cyan: 'hsl(var(--portal-cyan))',
					glass: 'hsl(var(--portal-glass))',
					'glass-muted': 'hsl(var(--portal-glass-muted))',
					line: 'hsl(var(--portal-line))',
					'soft-blue': 'hsl(var(--portal-soft-blue))',
					'soft-cyan': 'hsl(var(--portal-soft-cyan))',
				}
			},
			boxShadow: {
				'portal-shell': '0 32px 72px -24px hsl(var(--portal-shadow) / 0.26), inset 0 1px 0 hsl(var(--portal-glass) / 0.9)',
				'portal-card': '0 12px 24px -16px hsl(var(--portal-shadow) / 0.3), inset 0 1px 0 hsl(var(--portal-glass))',
				'portal-card-hover': '0 24px 42px -20px hsl(var(--portal-blue) / 0.42), inset 0 1px 0 hsl(var(--portal-glass))',
				'portal-active': '0 18px 32px -16px hsl(var(--portal-blue) / 0.65), inset 0 1px 0 hsl(var(--portal-glass) / 0.32)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'portal-float': {
					'0%, 100%': { transform: 'translateY(0) rotate(8deg)' },
					'50%': { transform: 'translateY(-12px) rotate(4deg)' },
				},
				'portal-drift': {
					'0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(-10deg)' },
					'50%': { transform: 'translate3d(10px, -8px, 0) rotate(-4deg)' },
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'portal-float': 'portal-float 6s ease-in-out infinite',
				'portal-drift': 'portal-drift 8s ease-in-out infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
