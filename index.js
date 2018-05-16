const { resolve } = require('path')

module.exports = async function module(moduleOptions) {
	const defaults = {
		alias: 'stash',
	}
	const options = Object.assign({}, defaults, moduleOptions)

	this.addPlugin({
		src: resolve(__dirname, 'plugin.js'),
		options,
	})
}

module.exports.meta = require('./package.json')
