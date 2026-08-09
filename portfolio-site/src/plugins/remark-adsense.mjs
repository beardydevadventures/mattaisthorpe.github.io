const AD_MARKER = /^:::ad\s*\n:::\s*$/;

export default function remarkAdSense() {
	return (tree) => {
		for (let index = 0; index < tree.children.length; index += 1) {
			const node = tree.children[index];
			if (node.type !== "paragraph" || node.children?.length !== 1) continue;

			const child = node.children[0];
			if (child.type !== "text" || !AD_MARKER.test(child.value)) continue;

			tree.children[index] = {
				type: "html",
				value: `<div class="adsense-placement"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2573721355823332" data-ad-slot="1165458144" data-ad-format="auto" data-full-width-responsive="true"></ins></div>`,
			};
		}
	};
}
