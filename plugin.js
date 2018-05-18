import Vue from 'vue'

const createStash = process.server ? require('@/stash').default : null

const options = JSON.parse('<%= JSON.stringify(options) %>')

export default async ctx => {
	let stash
	if (process.server) {
		stash = await createStash(ctx)
		ctx.beforeNuxtRender(function({ nuxtState }) {
			// nuxtState goes to window.__NUXT__
			nuxtState.stash = stash
		})
	} else {
		stash = window.__NUXT__.stash
	}

	// NOTE: use custom inject function rather than the one typically passed by Nuxt
	inject(ctx.app, options.alias, stash)
}

// Works the same way as the one passed by Nuxt - as with (ctx, inject) -
// but makes the value object reactive.
function inject (app, key, value) {
	const protoKey = '$' + key
	app[protoKey] = value
	app.mixins = app.mixins || []
	app.mixins.push({
		data () {
			return { [key]: this.$options[protoKey] }
		},
	})
	Vue.use(function () {
		if (!Vue.prototype.hasOwnProperty(protoKey)) {
			Object.defineProperty(Vue.prototype, protoKey, {
				get () {
					return this.$root[key]
				},
			})
		}
	})
}
