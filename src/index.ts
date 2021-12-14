import { Root } from "hast";
import { h } from "hastscript";
import { Plugin } from "unified";
import { findAndReplace } from "hast-util-find-and-replace";
import { visit } from "unist-util-visit";

export type RehypeEmojiOptions = {
  emojis: Record<string, string>;
  className?: string;
  ignore?: string | string[];
};

const defaultOptions: RehypeEmojiOptions = {
  emojis: {},
  className: "emoji",
  ignore: "code"
};

const rehypeCustomEmoji: Plugin<[RehypeEmojiOptions?], Root> = (
  options: RehypeEmojiOptions
) => {
  const opts = { ...defaultOptions, ...options };
  const replace_maps: Record<string, any> = {};
  Object.entries(opts.emojis).forEach(([emoji_code, path]) => {
    replace_maps[`:${emoji_code}:`] = h("img", {
      src: path,
      className: opts.className,
    });
  });

  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.properties.dataEmoji === undefined && node.tagName !== "p") {
        return
      }
      findAndReplace(node, replace_maps, { ignore: opts.ignore });
    })
  };
};

export default rehypeCustomEmoji;
