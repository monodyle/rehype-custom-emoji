import { describe, expect, test } from "vitest";
import { unified } from "unified";
import rehypeRaw from "rehype-raw";
import remark2rehype from "remark-rehype";
import remarkParse from "remark-parse";
import stringify from "rehype-stringify";
import rehypeCustomEmoji, { type RehypeCustomEmojiOptions } from "../src";

const emojis = {
	hello: "/path/hello.png",
	wave: "https://example.com/wave.gif",
};

const parser = (content: string, options: RehypeCustomEmojiOptions) =>
	unified()
		.use(remarkParse)
		.use(remark2rehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(rehypeCustomEmoji, options)
		.use(stringify)
		.processSync(content)
		.toString();

describe("rehypeCustomEmoji", () => {
	test("tag", () => {
		const mrkStr = "# Hello\n\n```:hello:```\n\nWhat a beautiful day :hello:";
		const expected =
			'<h1>Hello</h1>\n<p><code>:hello:</code></p>\n<p>What a beautiful day <img class="emoji" title=":hello:" alt=":hello:" src="/path/hello.png" height="20" width="20" align="absmiddle"></p>';
		const htmlStr = parser(mrkStr, { emojis });
		expect(htmlStr).toEqual(expected);
	});
});
