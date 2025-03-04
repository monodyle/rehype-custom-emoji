import type { Root } from "hast";
import { findAndReplace } from "hast-util-find-and-replace";

function defaultBuild(src: string, value: string) {
	return {
		type: "element",
		tagName: "img",
		properties: {
			className: ["emoji"],
			title: value,
			alt: value,
			src,
			height: 20,
			width: 20,
			align: "absmiddle",
		},
		children: [],
	};
}

const defaultIgnore = ["pre", "code", "tt"];

const emojiRegex = /:(\+1|[-\w]+):/g;

export type RehypeCustomEmojiOptions = {
	emojis?: Record<string, string>;
	ignore?: Array<string>;
	build?: (src: string, value: string) => Element | string;
};

export default function rehypeCustomEmoji(options: RehypeCustomEmojiOptions) {
	const config = options || {};
	const ignore = config.ignore || defaultIgnore;
	const build = config.build || defaultBuild;
	const emojis = config.emojis || {};

	return (tree: Root) => {
		findAndReplace(
			tree,
			[
				[
					emojiRegex,
					function replaceGemoji($0, $1) {
						if (emojis[$1]) {
							return build(emojis[$1], $0) as string;
						}
					},
				],
			],
			{ ignore },
		);
	};
}
