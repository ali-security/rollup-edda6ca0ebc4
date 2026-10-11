const assert = require('assert');

module.exports = {
	description:
		'does not use a clobbered document.currentScript to resolve import.meta.url and file URLs in UMD output',
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
			assetFileNames: 'assets/[name][extname]',
			format: 'umd',
			name: 'bundle'
		}
	},
	context: {
		// Simulates DOM clobbering via <form name="currentScript"> carrying a src attribute
		document: {
			baseURI: 'https://example.com/app/index.html',
			currentScript: {
				src: 'https://attacker.example/evil.js',
				tagName: 'FORM'
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
