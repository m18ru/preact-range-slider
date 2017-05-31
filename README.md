# preact-range-slider

Preact component for input values with range slider

Based on `rc-slider` for React, with a lot of changes (so, this component is not
compatible with original).

Written in TypeScript, types are also included.

## Demo

[On CodePen](https://codepen.io/avol/pen/LyovJb).

## Installation

For bundlers and other NPM-based environments:

```
npm install --save-dev preact tslib preact-range-slider
```

Package `tslib` required in ES5-ESM version for `__extends` and `__assign`
helper functions. It's not required for ES2015 version and for UMD version
(functions is included in UMD).

## Usage

There is two components:

* `Slider` — for range slider with one handle.
* `MultiSlider` — for range slider with multiple handles (two and more).

```jsx
render(
	<div>
		<Slider />
		<MultiSlider />
	</div>,
	container
);
```

### UMD

UMD is default for this package, so just use something like:

```js
import {Slider, MultiSlider} from 'preact-range-slider';
// or
const {Slider, MultiSlider} = require( 'preact-range-slider' );
```

For using directly in browser (import with `<script>` tag in HTML-file):

* [Development version](https://unpkg.com/preact-range-slider/es5/index.js)
* [Production version](https://unpkg.com/preact-range-slider/es5/preact-range-slider.min.js)

You can use AMD or `PreactRangeSlider` global variable.

### ES2015 module systems

Package contain `module` property for use with ES2015 module bundlers
(like Rollup and Webpack 2).

### ES2015 code base

If you don't want to use transplitted to ES5 code, you can use included
ES2015 version.

You can directly import this version:

```js
import {Slider, MultiSlider} from 'preact-range-slider/es2015';
```

Or specify alias in Webpack config:

```js
{
	// …
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
			'preact-range-slider': 'preact-range-slider/es2015',
		},
	},
};
```

### Styles

You can use SCSS mixin from `preact-range-slider/assets/_mixin.scss`, where
you can specify prefix for internal classes:

```scss
div.my-range-slider
{
	@import "mixin";
	@include range-slider("my-");
}
```

Or you can use compiled CSS file `preact-range-slider/assets/index.css` with
default parameters (`div.range-slider` element, internal classes without
prefix).

## API

### Common properties

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `min` | `number` | `0` | The minimum value of the slider. |
| `max` | `number` | `100` | The maximum value of the slider. |
| `step` | `number` | `1` | Value to be added or subtracted on each step the slider makes. Step can be set to zero or less to make `marks` as steps. |
| `marks` | `{[key: number]: string | JSX.Element | Array<string | JSX.Element>}` | `{}` | Marks on the slider. The key determines the position, and the value determines what will show. |
| `dots` | `boolean` | `false` | Show dots on slider (with step as interval)? |
| `included` | `boolean` | `true` | As continuous value interval (otherwise, as independent values)? |
| `vertical` | `boolean` | `false` | Vertical slider mode? |
| `disabled` | `boolean` | `false` | Disable control (handles can't be moved)? |
| `className` | `string` | `'range-slider'` | Component main class name. |
| `classesPrefix` | `string` | `''` | Prefix for secondary class names in component. |
| `tipFormatter` | `( value: number ) => string | JSX.Element | Array<string | JSX.Element>` | `String` | A function to format value on tooltip. |

### Slider properties

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `defaultValue` | `number` | `0` | Initial value of slider. |
| `value` | `number` | `undefined` | Current value of slider (for controlled component). |
| `onBeforeChange` | `( value: number ) => void` | `noop` | Triggered before value is start to change (on mouse down, etc). |
| `onChange` | `( value: number ) => void` | `noop` | Triggered while the value of Slider changing. |
| `onAfterChange` | `( value: number ) => void` | `noop` | Triggered after slider changes stop (on mouse up, etc). |

### MultiSlider properties

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `defaultValue` | `number[]` | `[0, 0]` | Initial value of slider. |
| `value` | `number[]` | `undefined` | Current value of slider (for controlled component). |
| `count` | `number` | `1` | How many ranges to render (handles count = count + 1). |
| `allowCross` | `boolean` | `true` | Allow handles to cross each other? |
| `pushable` | `boolean | number` | `false` | Allow pushing of surrounding handles when moving? When set to a number, the number will be the minimum ensured distance between handles. |
| `onBeforeChange` | `( value: number[] ) => void` | `noop` | Triggered before value is start to change (on mouse down, etc). |
| `onChange` | `( value: number[] ) => void` | `noop` | Triggered while the value of Slider changing. |
| `onAfterChange` | `( value: number[] ) => void` | `noop` | Triggered after slider changes stop (on mouse up, etc). |

## License

[MIT](https://github.com/m18ru/preact-range-slider/blob/master/LICENSE).
