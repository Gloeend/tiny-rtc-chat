import { type Config } from 'tailwindcss'

export default {
	content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
	theme: {
		extend: {
			colors: {
				primary: 'hsl(var(--primary))',
				'primary-foreground': 'hsl(var(--primary-foreground))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				input: 'hsl(var(--input))',
				border: 'hsl(var(--border))',
				secondary: 'hsl(var(--secondary))',
				'secondary-foreground': 'hsl(var(--secondary-foreground))',
				destructive: 'hsl(var(--destructive))',
				'destructive-foreground': 'hsl(var(--destructive-foreground))',
				accent: 'hsl(var(--accent))',
				'accent-foreground': 'hsl(var(--accent-foreground))'
			},
			borderColor: {
				DEFAULT: 'var(--border)'
			}
		}
	},
	plugins: []
} satisfies Config
