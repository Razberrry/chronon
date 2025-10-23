import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { resolve } from "path";

const injectCssIntoJsPlugin = (): Plugin => {
	return {
		name: "chronon-timeline:inject-css-into-js",
		enforce: "post",
		apply: "build",
		generateBundle: (_, bundle) => {
			const cssAssets = Object.entries(bundle).filter(
				([fileName, asset]) => asset.type === "asset" && fileName.endsWith(".css"),
			);

			if (cssAssets.length === 0) {
				return;
			}

			const cssContent = cssAssets
				.map(([, asset]) => {
					const source = asset.source;
					return typeof source === "string"
						? source
						: Buffer.from(source).toString("utf8");
				})
				.join("\n");

			for (const [fileName] of cssAssets) {
				delete bundle[fileName];
			}

			const injection = `if (typeof document !== "undefined") {
	if (!document.head.querySelector('style[data-chronon-timeline="styles"]')) {
		const styleEl = document.createElement("style");
		styleEl.dataset.chrononTimeline = "styles";
		styleEl.textContent = ${JSON.stringify(cssContent)};
		document.head.appendChild(styleEl);
	}
}
`;

			for (const chunk of Object.values(bundle)) {
				if (chunk.type === "chunk" && chunk.isEntry) {
					chunk.code = injection + chunk.code;
				}
			}
		},
	};
};

export default defineConfig({
	plugins: [react(), injectCssIntoJsPlugin()],
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "chronon-timeline",
			fileName: (format) => `chronon-timeline.${format}.js`,
			formats: ["es", "cjs"],
		},
		rollupOptions: {
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
	},
});
