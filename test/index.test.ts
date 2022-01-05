import { unified } from "unified";
import gfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remark2rehype from "remark-rehype";
import remarkParse from "remark-parse";
import stringify from "rehype-stringify";
import rehypeCustomEmoji, { RehypeEmojiOptions } from "../src";

const emojis = {
  hello: "/path/hello.png",
  wave: "https://example.com/wave.gif",
};

const parser = (content: string, options: RehypeEmojiOptions) =>
  unified()
    .use(remarkParse)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeCustomEmoji, options)
    .use(stringify)
    .processSync(content)
    .toString();

describe("rehypeCustomEmoji", () => {
  it("<p> tag", () => {
    const mrkStr = "# Hello\n\n```:hello:```\n\nWhat a beautiful day :hello:";
    const expected =
      '<h1>Hello</h1>\n<p><code>:hello:</code></p>\n<p>What a beautiful day <img src="/path/hello.png" class="emoji" alt=":hello:"></p>';
    const htmlStr = parser(mrkStr, { emojis });
    expect(htmlStr).toEqual(expected);
  });

  it("[data-emoji] property", () => {
    const mrkStr = "# Hello\n\n<div>Hello <span data-emoji>:wave:</span></div>";
    const expected =
      '<h1>Hello</h1>\n<div>Hello <span data-emoji=""><img src="https://example.com/wave.gif" class="emoji" alt=":wave:"></span></div>';
    const htmlStr = parser(mrkStr, { emojis });
    expect(htmlStr).toEqual(expected);
  });

  it("custom className", () => {
    const mrkStr = "Hello, I'm rehypeCustomEmoji :wave:";
    const expected =
      '<p>Hello, I\'m rehypeCustomEmoji <img src="https://example.com/wave.gif" class="customEmoji" alt=":wave:"></p>';
    const htmlStr = parser(mrkStr, { emojis, className: "customEmoji" });
    expect(htmlStr).toEqual(expected);
  });

  it("disable alt", () => {
    const mrkStr = "Hello, I'm rehypeCustomEmoji :wave:";
    const expected =
      '<p>Hello, I\'m rehypeCustomEmoji <img src="https://example.com/wave.gif" class="emoji"></p>';
    const htmlStr = parser(mrkStr, { emojis, alt: false });
    expect(htmlStr).toEqual(expected);
  });

  it("ignore <div>", () => {
    const mrkStr = "# Hello\n\n<div>Hello :wave:</div>";
    const expected = "<h1>Hello</h1>\n<div>Hello :wave:</div>";
    const htmlStr = parser(mrkStr, { emojis, ignore: "div" });
    expect(htmlStr).toEqual(expected);
  });

  it("ignore <div> and <p>", () => {
    const mrkStr = "# Hello\n\n<div>Hello :wave:</div>\n\n:hello:";
    const expected = "<h1>Hello</h1>\n<div>Hello :wave:</div>\n<p>:hello:</p>";
    const htmlStr = parser(mrkStr, { emojis, ignore: ["div", "p"] });
    expect(htmlStr).toEqual(expected);
  });
});
