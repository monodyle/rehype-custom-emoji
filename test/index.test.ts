import { unified } from "unified";
import gfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remark2rehype from "remark-rehype";
import remarkParse from "remark-parse";
import stringify from "rehype-stringify";
import rehypeCustomEmoji from "../src";

const mrkStr = "# Hello\n\n```:hello:```\n\nWhat a beautiful day :hello:";
const emojis = {
  hello: "/path/hello.png",
};

describe("rehypeCustomEmoji", () => {
  it("findAndReplace", () => {
    const expected =
      '<h1>Hello</h1>\n\n<p><code>:hello:</code></p>\n\n<p>What a beautiful day <img src="/path/hello.png" class="emoji"></p>';
    const htmlStr = unified()
      .use(remarkParse)
      .use(remark2rehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeCustomEmoji, { emojis })
      .use(stringify)
      .processSync(mrkStr)
      .toString();
    expect(htmlStr).toEqual(expected);
  });
});
