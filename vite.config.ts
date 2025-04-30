import fs from "node:fs";
/// <reference types="vitest/config" />
import path from "node:path";

import react from "@vitejs/plugin-react";

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from "vite";
// import checker from 'vite-plugin-checker';
// import compression from 'vite-plugin-compression';
import { createHtmlPlugin } from "vite-plugin-html";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
	// 加载环境变量
	const { VITE_PORT, VITE_TITLE, VITE_APP_BASE_PATH, VITE_LOCAL_API_URL } = loadEnv(mode, process.cwd(), "");
	const base = VITE_APP_BASE_PATH ?? "/";
	const isProduction = mode === "production";

	// 显式读取 package.json（避免 ESM 导入问题）
	const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));
	return {
		// 基础路径
		base,

		// 开发服务器配置
		server: {
			open: true,
			host: true,
			port: Number(VITE_PORT) ?? 3001,
			proxy: {
				"/api": {
					// target: VITE_API_URL || "http://localhost:3000",
					target: VITE_LOCAL_API_URL || "http://localhost:3000",
					changeOrigin: true,
					// rewrite: (path) => path.replace(/^\/api/, ''),
					secure: false,
				},
			},
		},
		// 获取前段项目所需的依赖版本信息
		define: {
			__APP_DEPS__: JSON.stringify({
				dependencies: packageJson.dependencies,
				devDependencies: packageJson.devDependencies,
			}),
		},

		// 测试用例配置
		test: {
			// 启用全局变量
			globals: true,
			// 设置测试环境为 jsdom | happy-dom
			environment: "jsdom",
			// 指定测试前的设置文件
			setupFiles: path.resolve(__dirname, "./vitest.setup.ts"),
			// 包含的测试文件路径
			include: ["src/__tests__/**/*.test.{ts,tsx}"],
			// 排除的测试文件路径
			exclude: ["**/node_modules/**", "**/dist/**", "src/main.tsx"],

			// 加载环境变量
			env: loadEnv(mode, process.cwd(), ""),

			// 路径别名（与 Vite 配置对齐）
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"@/assets": path.resolve(__dirname, "./src/assets"),
				// '^!!raw-loader!': path.resolve(__dirname, './__mocks__/rawLoaderMock.js'),
			},

			// 覆盖率配置
			coverage: {
				// 是否启用收集测试覆盖率
				enabled: true,
				// 覆盖率提供商: v8 | ìstanbul
				provider: "v8",
				reporter: ["text", "json", "clover", "lcov", "html"],
				// 更改默认覆盖文件夹位置
				reportsDirectory: "./coverage",
				// 是否在重新运行时清除覆盖率数据
				cleanOnRerun: true,
				// 是否在失败时也生成覆盖率报告
				reportOnFailure: true,
				// 是否在运行测试时收集覆盖率数据
				excludeNodeModules: true,
				// 包含和排除的文件
				include: ["src/**/*.{ts,tsx}"],
				exclude: ["**/*.d.ts", "**/*.stories.tsx", "src/__tests__/**", "src/_mocks/**"],
				// 覆盖阈值
				// thresholds: {
				// 	// 设置每个文件的阈值
				// 	lines: 80,
				// 	// 设置每个函数的阈值
				// 	functions: 75,
				// 	// 设置每个分支的阈值
				// 	branches: 80,
				// 	// 设置每个语句的阈值
				// 	statements: 80,
				// },
			},

			// 配置环境选项
			// environmentOptions: {
			// 	resources: 'usable',
			// },

			// 依赖处理
			// deps: {
			// 	inline: ['@vanilla-extract/css', 'vite-plugin-svg-icons', 'react-helmet-async'],
			// 	external: ['**/node_modules/**'],
			// },

			// 测试服务器
			// server: {
			// 	deps: {
			// 		fallbackCJS: true,
			// 	},
			// },

			// 自定义配置
			// css: {
			// 	modules: {
			// 		localsConvention: 'stable' | 'scoped' | 'non-scoped'
			// 	},
			// },

			// 输出配置
			// reporters: ['default', 'html'],
			// // 配置测试报告输出文件
			// outputFile: {
			// 	html: './test-results/index.html',
			// },

			// TS类型检查
			// typecheck: {
			// 	enabled: true,
			// 	include: ['src/**/*.test.{ts,tsx}'],
			// },
		},

		// 插件配置
		plugins: [
			// 添加 React 插件的优化配置,添加 Babel 插件以支持装饰器和类属性
			react({
				babel: {
					parserOpts: {
						plugins: ["decorators-legacy", "classProperties"],
					},
				},
			}),
			// 用于在开发过程中提供实时的代码检查和错误报告。它集成了多种检查工具，如 TypeScript、VLS (Vetur Language Server)、ESLint、Stylelint 等，帮助开发者在开发阶段就能发现和修复代码中的问题。
			// checker({
			// 	typescript: true,
			// }),
			// 用于增强 Vite 项目的 HTML 模板功能。它允许开发者在构建过程中动态地修改和注入 HTML 内容，从而提供更灵活的 HTML 模板处理能力。
			// 动态注入: 可以在 HTML 文件中动态注入变量、脚本、样式等。
			// 模板处理: 支持使用模板引擎语法来处理 HTML 文件。
			// 多页面支持: 方便地处理多页面应用的 HTML 模板。
			createHtmlPlugin({
				inject: {
					data: {
						title: VITE_TITLE, // 动态注入标题
					},
				},
			}),
			// 用于 CSS-in-JS 解决方案的插件
			vanillaExtractPlugin({
				identifiers: ({ debugId }) => `${debugId}`,
			}),
			// 配置 tsconfig 路径插件，以支持 TypeScript 路径别名
			tsconfigPaths(),
			// 配置 SVG 图标插件，用于处理 SVG 图标
			createSvgIconsPlugin({
				iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
				symbolId: "icon-[dir]-[name]",
			}),
			// 生产环境下的打包分析插件，生成打包报告
			isProduction &&
				visualizer({
					open: true,
					gzipSize: true,
					brotliSize: true,
					template: "treemap", // 使用树形图更直观
				}),
			// 用于在构建阶段对生成的静态资源文件（如 JavaScript、CSS、HTML 等）进行压缩，生成 .gz 或 .br 等压缩文件。这些压缩文件可以在部署到服务器时直接提供给客户端，从而减少文件传输大小，提高页面加载速度
			// isProduction &&
			// 	// VITE_BUILD_GZIP &&
			// 	compression({
			// 		verbose: true, // 是否在控制台输出压缩结果
			// 		disable: false, // 是否禁用压缩（用于调试）
			// 		threshold: 10240, // 只有大于该大小的文件会被压缩，单位为字节
			// 		algorithm: 'gzip', // 压缩算法，可选 'gzip' 或 'brotliCompress'
			// 		ext: '.gz', // 生成的压缩文件后缀
			// 	}),
		].filter(Boolean),

		// 构建配置
		build: {
			// 设置构建目标
			target: "esnext",
			// 使用 esbuild 进行代码压缩
			minify: "esbuild",
			// 在非生产环境下生成源码映射
			sourcemap: !isProduction,
			// 启用 CSS 代码分割
			cssCodeSplit: true,
			// 设置块大小警告限制
			chunkSizeWarningLimit: 1500,
			// 配置 Rollup 选项，手动分割代码块
			rollupOptions: {
				output: {
					manualChunks: {
						"vendor-core": ["react", "react-dom", "react-router"],
						"vendor-ui": ["antd", "@ant-design/icons", "@ant-design/cssinjs", "framer-motion", "styled-components"],
						"vendor-utils": ["axios", "dayjs", "i18next", "zustand", "@iconify/react"],
						"vendor-charts": ["apexcharts", "react-apexcharts"],
					},
					// 分类配置
					chunkFileNames: "assets/js/[name]-[hash].js",
					entryFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
					// // 更精细的手动分块策略
					// manualChunks: (id) => {
					// 	// 分离核心框架代码
					// 	if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
					// 		return "vendor-react";
					// 	}
					// 	// 分离路由相关
					// 	if (id.includes("react-router") || id.includes("history")) {
					// 		return "vendor-router";
					// 	}
					// 	// 分离复杂组件库
					// 	if (id.includes("antd") || id.includes("@ant-design") || id.includes("framer-motion")) {
					// 		return "vendor-ui";
					// 	}
					// 	// 分离可视化相关
					// 	if (
					// 		id.includes("apexcharts") ||
					// 		id.includes("react-apexcharts") ||
					// 		id.includes("d3") ||
					// 		id.includes("nivo")
					// 	) {
					// 		return "vendor-charts";
					// 	}
					// 	// 分离国际化相关
					// 	if (id.includes("i18next") || id.includes("react-i18next")) {
					// 		return "vendor-i18n";
					// 	}
					// 	// 分离状态管理
					// 	if (id.includes("zustand") || id.includes("redux")) {
					// 		return "vendor-state";
					// 	}
					// 	// 分离工具库
					// 	if (id.includes("lodash") || id.includes("ramda") || id.includes("dayjs") || id.includes("axios")) {
					// 		return "vendor-utils";
					// 	}
					// 	// 分离富文本编辑器
					// 	if (id.includes("react-quill") || id.includes("quill")) {
					// 		return "vendor-editor";
					// 	}
					// },
					// // 优化文件命名策略
					// chunkFileNames: (chunkInfo) => {
					// 	// 对异步 chunk 使用不同的命名策略
					// 	if (chunkInfo.isDynamicEntry) {
					// 		return "assets/dynamic/[name]-[hash].js";
					// 	}
					// 	return "assets/chunks/[name]-[hash].js";
					// },
					// // 使用 contenthash 替代 hash 提升缓存效率
					// entryFileNames: "assets/js/[name]-[hash].js",
					// assetFileNames: "assets/js/[name]-[hash].js",

					// manualChunks: (id) => {
					// 	// 核心框架
					// 	if (/[\\/]node_modules[\\/](react|react-dom|scheduler|use-sync-external-store)/.test(id)) {
					// 		return "vendor-react";
					// 	}

					// 	// 路由系统
					// 	if (/[\\/]node_modules[\\/](react-router|history|@remix-run)/.test(id)) {
					// 		return "vendor-router";
					// 	}

					// 	// UI 组件库
					// 	if (/[\\/]node_modules[\\/](antd|@ant-design|framer-motion|@dnd-kit)/.test(id)) {
					// 		return "vendor-ui";
					// 	}

					// 	// 数据可视化
					// 	if (/[\\/]node_modules[\\/](apexcharts|d3|nivo|victory)/.test(id)) {
					// 		return "vendor-charts";
					// 	}

					// 	// 状态管理
					// 	if (/[\\/]node_modules[\\/](zustand|redux|mobx|@tanstack)/.test(id)) {
					// 		return "vendor-state";
					// 	}

					// 	// 国际化
					// 	if (/[\\/]node_modules[\\/](i18next|react-i18next)/.test(id)) {
					// 		return "vendor-i18n";
					// 	}

					// 	// 富文本编辑器
					// 	if (/[\\/]node_modules[\\/](react-quill|quill|slate)/.test(id)) {
					// 		return "vendor-editor";
					// 	}

					// 	// 工具库
					// 	if (/[\\/]node_modules[\\/](lodash|ramda|dayjs|axios|clsx|classnames)/.test(id)) {
					// 		return "vendor-utils";
					// 	}

					// 	// Markdown 处理
					// 	if (/[\\/]node_modules[\\/](react-markdown|remark|rehype|unified)/.test(id)) {
					// 		return "vendor-markdown";
					// 	}

					// 	// 日历组件
					// 	if (/[\\/]node_modules[\\/]@fullcalendar/.test(id)) {
					// 		return "vendor-calendar";
					// 	}
					// },

					// // 文件输出策略
					// entryFileNames: "assets/js/[name]-[hash:8].js",
					// chunkFileNames: (chunkInfo) => {
					// 	if (chunkInfo.isDynamicEntry) {
					// 		return "assets/async/[name]-[hash:8].js";
					// 	}
					// 	if (chunkInfo.name.startsWith("vendor-")) {
					// 		return "assets/vendor/[name]-[hash:8].js";
					// 	}
					// 	return "assets/chunks/[name]-[hash:8].js";
					// },

					// assetFileNames: ({ names }) => {
					// 	// const ext = names?.split(".").pop()?.toLowerCase() || "misc";
					// 	const firstName = Array.isArray(names) ? names[0] : names;
					// 	const ext = firstName?.split(".").pop()?.toLowerCase() || "misc";
					// 	// return `assets/${ext}/[name]-[hash][extname]`;
					// 	const dirMap = {
					// 		css: "css",
					// 		svg: "images",
					// 		png: "images",
					// 		jpg: "images",
					// 		jpeg: "images",
					// 		webp: "images",
					// 		gif: "images",
					// 		woff2: "fonts",
					// 		woff: "fonts",
					// 		ttf: "fonts",
					// 		eot: "fonts",
					// 		otf: "fonts",
					// 	};
					// 	return `assets/${dirMap[ext] || "misc"}/[name]-[hash:8][extname]`;
					// },

					// // 高级优化配置
					// compact: true,
					// generatedCode: {
					// 	preset: "es2015",
					// 	arrowFunctions: true,
					// 	constBindings: true,
					// },
					// minifyInternalExports: true,

					// // 优化后的资源处理配置
					// assetFileNames: (assetInfo) => {
					// 	if (!assetInfo.fileName) return "assets/[name]-[hash][extname]";
					// 	// 使用现代路径解析方式
					// 	const { name: fileName, ext: fileExt } = path.parse(assetInfo.fileName);
					// 	const extType = fileExt.toLowerCase().replace(".", "");
					// 	// 基于类型的目录映射
					// 	const typeDirs = {
					// 		svg: "images",
					// 		png: "images",
					// 		jpg: "images",
					// 		jpeg: "images",
					// 		webp: "images",
					// 		gif: "images",
					// 		woff: "fonts",
					// 		woff2: "fonts",
					// 		eot: "fonts",
					// 		ttf: "fonts",
					// 		otf: "fonts",
					// 		css: "css",
					// 	};
					// 	// 获取分类目录
					// 	const dir = typeDirs[extType] || "misc";
					// 	const hash = "[hash:10]"; // 缩短 hash 长度
					// 	// 处理带路径的资源
					// 	const baseName = path.basename(fileName, fileExt);
					// 	// 特殊处理 CSS 文件
					// 	if (extType === "css") {
					// 		return `assets/${dir}/[name]-${hash}${fileExt}`;
					// 	}
					// 	return `assets/${dir}/${baseName}-${hash}${fileExt}`;
					// },
				},
			},
		},

		// 优化依赖预构建
		optimizeDeps: {
			include: ["react", "react-dom", "react-router", "antd", "@ant-design/icons", "axios", "dayjs"],
			exclude: ["@iconify/react"], // 排除不需要预构建的依赖
		},

		// esbuild 优化配置
		esbuild: {
			// 在生产环境下移除 console 和 debugger 语句
			drop: isProduction ? ["console", "debugger"] : [],
			// 移除法律声明注释
			legalComments: "none",
			// 设置构建目标为 esnext
			target: "esnext",
		},
	};
});
