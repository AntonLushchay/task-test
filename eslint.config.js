import antfu from '@antfu/eslint-config';

export default antfu({
	javascript: true,
	typescript: false,
	formatters: {
		css: true,
		html: false,
		markdown: true,
	},
	stylistic: {
		indent: 'tab',
		quotes: 'single',
		semi: true,
	},
});
