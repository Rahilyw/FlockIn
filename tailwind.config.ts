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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					hover: 'hsl(var(--primary-hover))'
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
				campus: {
					blue: 'hsl(var(--campus-blue))',
					purple: 'hsl(var(--campus-purple))',
					orange: 'hsl(var(--campus-orange))',
					green: 'hsl(var(--campus-green))'
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
				// DESIGN.md flat tokens
				'surface-variant': '#e4e2dd',
				'on-surface': '#1b1c19',
				'on-surface-variant': '#524341',
				'inverse-surface': '#30312e',
				'inverse-on-surface': '#f2f1ec',
				'surface-bright': '#fbf9f4',
				'surface-dim': '#dbdad5',
				'surface-container': '#f0eee9',
				'surface-container-low': '#f5f3ee',
				'surface-container-high': '#eae8e3',
				'surface-container-highest': '#e4e2dd',
				'surface-container-lowest': '#ffffff',
				'primary-container': '#ffb3a7',
				'on-primary': '#ffffff',
				'on-primary-container': '#7a423a',
				'primary-fixed': '#ffdad4',
				'primary-fixed-dim': '#ffb4a8',
				'inverse-primary': '#ffb4a8',
				'secondary-container': '#bceddc',
				'on-secondary': '#ffffff',
				'on-secondary-container': '#406d60',
				'secondary-fixed': '#bceddc',
				'secondary-fixed-dim': '#a1d0c1',
				'tertiary': '#5a5c7c',
				'on-tertiary': '#ffffff',
				'tertiary-container': '#c3c3e8',
				'on-tertiary-container': '#4e506f',
				'tertiary-fixed': '#e1e0ff',
				'outline-variant': '#d7c2be',
				'error-container': '#ffdad6',
				'on-error-container': '#93000a',
			},
			fontFamily: {
				sans: ['Montserrat', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1rem',
				'3xl': '1.5rem',
			},
			spacing: {
				'gutter': '24px',
				'board-gap': '20px',
				'base-unit': '8px',
				'margin-desktop': '40px',
				'margin-mobile': '16px',
			},
			keyframes: {
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
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0px)' }
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-up': 'slide-up 0.3s ease-out'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-card': 'var(--gradient-card)'
			},
			boxShadow: {
				'card': 'var(--shadow-card)',
				'elevated': 'var(--shadow-elevated)',
				'glow': 'var(--shadow-glow)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;