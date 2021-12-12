import { Root } from "hast";
import { h } from "hastscript";
import { Plugin } from "unified";
import { findAndReplace } from "hast-util-find-and-replace";

export type RehypeEmojiOptions = {
  emojis: Record<string, string>;
  className?: string;
};

const defaultOptions: RehypeEmojiOptions = {
  emojis: {},
  className: "emoji",
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
    findAndReplace(tree, replace_maps, { ignore: "code" });
  };
};

export default rehypeCustomEmoji;
