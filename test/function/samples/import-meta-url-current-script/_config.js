const assert = require('assert');

module.exports = {
	description: 'uses the src of a script element in document.currentScript to resolve URLs',
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
		document: {
			baseURI: 'https://example.com/app/index.html',
			currentScript: {
				src: 'https://cdn.example.com/js/main.js',
				// lower-case tag names are reported in XHTML documents
				tagName: 'script'
			}
		}
	},
	exports(exports) {
		assert.deepStrictEqual(
			{ asset: exports.asset, url: exports.url },
			{
				asset: 'https://cdn.example.com/js/assets/asset.txt',
				url: 'https://cdn.example.com/js/main.js'
			}
		);
	}
};
