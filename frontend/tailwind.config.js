'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.default = {
	darkMode: 'class',
	content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
	theme: {
		extend: {
			letterSpacing: {
				'default': '-0.02em'
			},
			colors: {
				tiny: {
					'900': 'hsl(var(--tiny-900))'
				},
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
			},
			backgroundImage: {
				'channel-gradient': 'var(--card-gradient)'
			}
		}
	},
	plugins: []
}
