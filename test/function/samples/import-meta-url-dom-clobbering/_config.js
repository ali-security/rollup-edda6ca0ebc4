const assert = require('assert');

module.exports = {
	description:
		'does not use a clobbered document.currentScript to resolve import.meta.url and file URLs',
	options: {
		plugins: {
			transform(code) {
				return code.replace(
					'REFERENCE_ID',
					this.emitFile({ type: 'asset', name: 'asset.txt', source: 'asset' })
				);
			}
		},
		output: {
			assetFileNames: 'assets/[name][extname]'
		}
	},
	context: {
		// Simulates DOM clobbering via <img name="currentScript" src="https://attacker.example/evil.js">
		document: {
			baseURI: 'https://example.com/app/index.html',
			currentScript: {
				src: 'https://attacker.example/evil.js',
				tagName: 'IMG'
			}
		}
	},
	exports(exports) {
		assert.deepStrictEqual(
			{ asset: exports.asset, url: exports.url },
			{
				asset: 'https://example.com/app/assets/asset.txt',
				url: 'https://example.com/app/main.js'
			}
		);
	}
};
