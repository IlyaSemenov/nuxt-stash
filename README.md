# nuxt-stash

A Nuxt.js module that makes it easy to push **server-generated** context object to the Vue app and make it available to all Vue components.

The typical use is to allow Vue components to access currently logged user, or some global settings that are pulled from the database, without having to bother setting up Vuex with its actions and mutators.

This module was heavily inspired by (and borrowed the naming from) [vue-stash](https://github.com/cklmercer/vue-stash).

## Installation

Install package:

```sh
yarn add nuxt-stash
```

## Usage

Add module to `nuxt.config.js`:

```js
module.exports = {
	modules: [
		'nuxt-stash',
	],
}
```

Create `stash.js` or `stash/index.js` in your Nuxt application source directory:

```js
export default async function createStash (ctx) {
	// ctx here is Nuxt.js context (https://nuxtjs.org/api/context/)
	return {
		foo: 'bar',
		user: await User.findById(ctx.req.session.userId),
	}
}
```

Keep in mind that the function will be called **only** during server-side rendering. The data will then be passed to client-side automatically.

During client-side rendering, the module will not be even imported. Therefore, it's safe to `import` server-side related stuff from there, it will not get webpacked into client-side build.

### Acessing stash

In your Vue components, access stash directly from the template:

```vue
<template>
<div>
	<p v-if="$stash.user">Hello, {{ $stash.user.name }}</p>
</div>
</template>
```

or from the script:

```vue
<template>
<div>
	<p v-if="user">Hello, {{ user.name }}</p>
</div>
</template>

<script>
export default {
	computed: {
		user () {
			return this.$stash.user
		},
	},
}
</script>
```

### Modifying stash

The stash is (intentionally) reactive, feel free to modify it from within the Vue app:

```vue
<template>
<div>
	<p>Foo is {{ $stash.foo }}</p>
	<button @click="$stash.foo = 'Changed!'">Change Foo</button>
</div>
</template>
```
