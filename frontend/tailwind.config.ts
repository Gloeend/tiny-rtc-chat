import { type Config } from 'tailwindcss'

export default {
	content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			screens: {
				'max-1312px': { max: '1312px' },
				'max-1312px-768px': { max: '1312px', min: '769px' },
				'max-768px': { max: '768px' },
				'max-768px-576px': { max: '768px', min: '576px' },
				'max-576px': { max: '576px' },
				'max-576px-480px': { max: '576px', min: '481px' },
				'max-480px': { max: '480px' },
				'max-480px-360px': { max: '480px', min: '361px' },
				'max-360px': { max: '360px' }
			},
			letterSpacing: {
				default: '-0.02em'
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
				'channel-gradient': 'linear-gradient(180deg, #1F1F1F 0%, #292929 100%)'
			}
		}
	},
	plugins: []
} satisfies Config
