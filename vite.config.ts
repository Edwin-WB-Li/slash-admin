/// <reference types="vitest/config" />
import path from 'node:path';
import react from '@vitejs/plugin-react';
// import type { UserConfig } from 'vite';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import compression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import tsconfigPaths from 'vite-tsconfig-paths';
// import { defineConfig } from 'vitest/config';
// import { configDefaults } from 'vitest/config.js';

// ... existing imports ...

export default defineConfig(({ mode }) => {
	// 加载环境变量
	const { VITE_PORT, VITE_TITLE, VITE_APP_BASE_PATH, VITE_LOCAL_API_URL } = loadEnv(mode, process.cwd(), '');
	const base = VITE_APP_BASE_PATH || '/';
	const isProduction = mode === 'production';

	return {
		// 基础路径
		base,

		// 开发服务器配置
		server: {
			open: true,
			host: true,
			port: Number(VITE_PORT) || 3001,
			proxy: {
				'/api': {
					// target: env.VITE_API_URL || 'http://localhost:3000',
					target: VITE_LOCAL_API_URL || 'http://localhost:3000',
					changeOrigin: true,
					// rewrite: (path) => path.replace(/^\/api/, ''),
					secure: false,
				},
			},
		},

		// 测试用例配置
		test: {
			// 启用全局变量
			globals: true,
			// 设置测试环境为 jsdom | happy-dom
			environment: 'jsdom',
			// 指定测试前的设置文件
			setupFiles: path.resolve(__dirname, './vitest.setup.ts'),
			// 包含的测试文件路径
			include: ['src/__tests__/**/*.test.{ts,tsx}'],
			// 排除的测试文件路径
			exclude: ['**/node_modules/**', '**/dist/**', 'src/main.tsx'],

			// 加载环境变量
			env: loadEnv(mode, process.cwd(), ''),

			// 路径别名（与 Vite 配置对齐）
			alias: {
				'@': path.resolve(__dirname, './src'),
				'@/assets': path.resolve(__dirname, './src/assets'),
				'^!!raw-loader!': path.resolve(__dirname, './__mocks__/rawLoaderMock.js'),
			},

			// 覆盖率配置
			coverage: {
				// 是否启用收集测试覆盖率
				enabled: true,
				// 覆盖率提供商: v8 | ìstanbul
				provider: 'v8',
				reporter: ['text', 'json', 'clover', 'lcov', 'html'],
				// 更改默认覆盖文件夹位置
				reportsDirectory: './coverage',
				// 是否在重新运行时清除覆盖率数据
				cleanOnRerun: true,
				// 是否在失败时也生成覆盖率报告
				reportOnFailure: true,
				// 是否在运行测试时收集覆盖率数据
				excludeNodeModules: true,
				// 包含和排除的文件
				include: ['src/**/*.{ts,tsx}'],
				exclude: ['**/*.d.ts', '**/*.stories.tsx', 'src/__tests__/**', 'src/mocks/**'],
				// 覆盖阈值
				thresholds: {
					// 设置每个文件的阈值
					lines: 80,
					// 设置每个函数的阈值
					functions: 75,
					// 设置每个分支的阈值
					branches: 80,
					// 设置每个语句的阈值
					statements: 80,
				},
				// 为 true 时启用测试覆盖率检查，不达标时会抛出异常
				checkCoverage: false,
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
						plugins: ['decorators-legacy', 'classProperties'],
					},
				},
			}),
			// 用于在开发过程中提供实时的代码检查和错误报告。它集成了多种检查工具，如 TypeScript、VLS (Vetur Language Server)、ESLint、Stylelint 等，帮助开发者在开发阶段就能发现和修复代码中的问题。
			checker({
				typescript: true,
			}),
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
				iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
				symbolId: 'icon-[dir]-[name]',
			}),
			// 生产环境下的打包分析插件，生成打包报告
			isProduction &&
				visualizer({
					open: true,
					gzipSize: true,
					brotliSize: true,
					template: 'treemap', // 使用树形图更直观
				}),
			// 用于在构建阶段对生成的静态资源文件（如 JavaScript、CSS、HTML 等）进行压缩，生成 .gz 或 .br 等压缩文件。这些压缩文件可以在部署到服务器时直接提供给客户端，从而减少文件传输大小，提高页面加载速度
			isProduction &&
				// VITE_BUILD_GZIP &&
				compression({
					verbose: true, // 是否在控制台输出压缩结果
					disable: false, // 是否禁用压缩（用于调试）
					threshold: 10240, // 只有大于该大小的文件会被压缩，单位为字节
					algorithm: 'gzip', // 压缩算法，可选 'gzip' 或 'brotliCompress'
					ext: '.gz', // 生成的压缩文件后缀
				}),
		].filter(Boolean),

		// 构建配置
		build: {
			// 设置构建目标
			target: 'esnext',
			// 使用 esbuild 进行代码压缩
			minify: 'esbuild',
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
						'vendor-core': ['react', 'react-dom', 'react-router'],
						'vendor-ui': ['antd', '@ant-design/icons', '@ant-design/cssinjs', 'framer-motion', 'styled-components'],
						'vendor-utils': ['axios', 'dayjs', 'i18next', 'zustand', '@iconify/react'],
						'vendor-charts': ['apexcharts', 'react-apexcharts'],
					},
				},
			},
		},

		// 优化依赖预构建
		optimizeDeps: {
			include: ['react', 'react-dom', 'react-router', 'antd', '@ant-design/icons', 'axios', 'dayjs'],
			exclude: ['@iconify/react'], // 排除不需要预构建的依赖
		},

		// esbuild 优化配置
		esbuild: {
			// 在生产环境下移除 console 和 debugger 语句
			drop: isProduction ? ['console', 'debugger'] : [],
			// 移除法律声明注释
			legalComments: 'none',
			// 设置构建目标为 esnext
			target: 'esnext',
		},
	};
});
