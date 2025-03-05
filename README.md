# rehype-custom-emoji

[![NPM version](https://img.shields.io/npm/v/rehype-custom-emoji.svg)](https://www.npmjs.com/package/rehype-custom-emoji)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A [rehype] plugin that transforms custom emoji codes into images.

## Installation

```bash
# npm
npm install rehype-custom-emoji

# yarn
yarn add rehype-custom-emoji

# pnpm
pnpm add rehype-custom-emoji
```

## Usage

Basic usage with custom emojis:

```js
import { rehype } from 'rehype';
import rehypeCustomEmoji from 'rehype-custom-emoji';

const htmlStr = rehype()
  .data('settings', { fragment: true })
  .use(rehypeCustomEmoji, {
    emojis: {
      hello: "/emoji/hello.png",
      wave: "https://example.com/wave.gif"
    },
  })
  .processSync(`
    # Welcome! :hello:

    Hey there! :wave:
  `)
  .toString();
```

This will transform the emoji codes (`:hello:` and `:wave:`) into image elements:

```html
<h1>Welcome! <img src="/emoji/hello.png" alt="hello" class="emoji"></h1>
<p>Hey there! <img src="https://example.com/wave.gif" alt="wave" class="emoji"></p>
```

## API

### `rehype().use(rehypeCustomEmoji[, options])`

#### options

##### `options.emojis`

Type: `Record<string, string>`\
Default: `{}`

An object mapping emoji codes to their image URLs. The keys are the emoji codes (without colons) and the values are the image URLs.

```js
{
  hello: "/emojis/hello.png",
  wave: "https://example.com/wave.gif",
  heart: "/assets/heart.svg"
}
```

##### `options.ignore`

Type: `string[]`\
Default: `["pre", "code", "tt"]`

Array of HTML tag names where emoji replacement should be ignored. This is useful for preventing emoji replacement in code blocks and other technical content.

##### `options.build`

Type: `(src: string, code: string) => Element | string`\
Default: Internal image element builder

A custom function to build the element that replaces the emoji code. This allows you to customize how emojis are rendered.

- `src`: The image URL from the emoji mapping
- `code`: The emoji code

## Examples

### With Custom Element Builder

```js
const options = {
  emojis: { heart: "/heart.png" },
  build: (src, code) => ({
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['emoji', `emoji-${code}`],
      style: `background-image: url(${src})`
    },
    children: []
  })
};
```

### Ignoring Additional Elements

```js
rehype()
  .use(rehypeCustomEmoji, {
    emojis: { info: "/info.png" },
    ignore: ["pre", "code", "tt", "kbd", "samp"]
  })
```

## License

[MIT](LICENSE) © [Monody Le](https://github.com/monodyle/)

[rehype]: https://github.com/rehypejs/rehype
