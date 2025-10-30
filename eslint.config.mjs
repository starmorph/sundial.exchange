import nextPlugin from "@next/eslint-plugin-next"

const coreWebVitalsConfig = nextPlugin.configs["core-web-vitals"]

export default [
	{
		ignores: ["coverage/**", "node_modules/**", ".next/**"],
	},
	{
		plugins: {
			"@next/next": nextPlugin,
		},
		rules: {
			...coreWebVitalsConfig.rules,
		},
	},
]

