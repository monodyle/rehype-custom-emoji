# rehype-custom-emoji

[rehype] plugin to create custom emoji

[rehype]: https://github.com/wooorm/rehype

## Installation

```bash
# yarn
yarn add rehype-custom-emoji

# npm
npm install rehype-custom-emoji
```

## API

`rehype().use(rehypeCustomEmoji, [options])`

### options

#### `options.emojis`

Type: `Record<string, string>`. Default value: `{}`

The object have key is an emoji code and value is the path of emoji (url).

Example:
```
{
  hello: "/emojis/hello.png",
  goodbye: "https://example.com/goodbye.png",
}
```

#### `options.className`

Type: `string`. Default value: `emoji`

The class name of image after rendered.

#### `options.ignore`

Type: `string` or `string[]`. Default value: `code`

Ignore tag(s) that contain emoji pattern.

#### `options.alt`

Type: `boolean`. Default value: `true`

Add emoji code to alt property in `img` tag.

## Usage

```js
import { rehype } from 'rehype';
import rehypeCustomEmoji from 'rehype-custom-emoji';

const htmlStr = rehype()
  .data('settings', { fragment: true })
  .use(
    rehypeCustomEmoji, {
      emojis: { hello: "/emoji/hello.png" },
      className: "custom_emoji"
    }
  )
  .processSync(`
    # Hello, world!

    Such a beautiful day :hello:
  `)
  .toString()
```

## License

MIT &copy; [Monody Le]

[Monody Le]: https://github.com/monodyle/
