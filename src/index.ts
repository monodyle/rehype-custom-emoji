import { Root } from "hast";
import { h } from "hastscript";
import { Plugin } from "unified";
import { findAndReplace } from "hast-util-find-and-replace";
import { visit } from "unist-util-visit";

export type RehypeEmojiOptions = {
  emojis: Record<string, string>;
  className?: string;
  ignore?: string | string[];
  alt?: boolean;
};

const defaultOptions: RehypeEmojiOptions = {
  emojis: {},
  className: "emoji",
  ignore: "code",
  alt: true,
};

const rehypeCustomEmoji: Plugin<[RehypeEmojiOptions?], Root> = (
  options: RehypeEmojiOptions
) => {
  const opts = { ...defaultOptions, ...options };
  const replace_maps: Record<string, any> = {};
  Object.entries(opts.emojis).forEach(([emoji_code, path]) => {
    const emoji = `:${emoji_code}:`;
    const properties = {
      src: path,
      className: opts.className,
      alt: opts.alt ? emoji : undefined,
    };
    replace_maps[emoji] = h("img", properties);
  });

  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.properties?.dataEmoji === undefined && node.tagName !== "p") {
        return;
      }
      findAndReplace(node, replace_maps, { ignore: opts.ignore });
    });
  };
};

export default rehypeCustomEmoji;
