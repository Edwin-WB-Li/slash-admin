// vite.config.ts
import path from "node:path";
import react from "file:///D:/project/GitHub/slash-admin/node_modules/.pnpm/@vitejs+plugin-react@4.3.4_vite@5.4.14_@types+node@20.5.1_terser@5.39.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { vanillaExtractPlugin } from "file:///D:/project/GitHub/slash-admin/node_modules/.pnpm/@vanilla-extract+vite-plugin@4.0.20_@types+node@20.5.1_babel-plugin-macros@3.1.0_terser@5.39._dmu6a3zikn72ahi5b5n6n5iwsa/node_modules/@vanilla-extract/vite-plugin/dist/vanilla-extract-vite-plugin.cjs.js";
import { visualizer } from "file:///D:/project/GitHub/slash-admin/node_modules/.pnpm/rollup-plugin-visualizer@5.14.0_rollup@4.36.0/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { defineConfig, loadEnv } from "file:///D:/project/GitHub/slash-admin/node_modules/.pnpm/vite@5.4.14_@types+node@20.5.1_terser@5.39.0/node_modules/vite/dist/node/index.js";
import checker from "file:///D:/project/GitHub/slash-admin/node_modules/.pnpm/vite-plugin-checker@0.9.1_@biomejs+biome@1.9.4_typescript@5.8.2_vite@5.4.14_@types+node@20.5.1_terser@5.39.0_/node_modules/vite-plugin-checker/dist/main.js";
import { createHtmlPlugin } from "file:///D:/project/GitHub/slash-admin/node_modules/.pnpm/vite-plugin-html@3.2.2_vite@5.4.14_@types+node@20.5.1_terser@5.39.0_/node_modules/vite-plugin-html/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///D:/project/GitHub/slash-admin/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.4.14_@types+node@20.5.1_terser@5.39.0_/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import tsconfigPaths from "file:///D:/project/GitHub/slash-admin/node_modules/.pnpm/vite-tsconfig-paths@5.1.4_typescript@5.8.2_vite@5.4.14_@types+node@20.5.1_terser@5.39.0_/node_modules/vite-tsconfig-paths/dist/index.js";
var __vite_injected_original_dirname = "D:\\project\\GitHub\\slash-admin";
var vite_config_default = defineConfig(({ mode }) => {
  const { VITE_PORT, VITE_TITLE, VITE_APP_BASE_PATH, VITE_LOCAL_API_URL } = loadEnv(mode, process.cwd(), "");
  const base = VITE_APP_BASE_PATH || "/";
  const isProduction = mode === "production";
  return {
    // 基础路径
    base,
    // 开发服务器配置
    server: {
      open: true,
      host: true,
      port: Number(VITE_PORT) || 3001,
      proxy: {
        "/api": {
          // target: env.VITE_API_URL || 'http://localhost:3000',
          target: VITE_LOCAL_API_URL || "http://localhost:3000",
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false
        }
      }
    },
    // 测试用例配置
    test: {
      // 启用全局变量
      globals: true,
      // 设置测试环境为 jsdom | happy-dom
      environment: "jsdom",
      // 指定测试前的设置文件
      setupFiles: "src/__tests__/vitest.setup.ts",
      // 包含的测试文件路径
      include: ["src/__tests__/**/*.test.{ts,tsx}"],
      // 排除的测试文件路径
      exclude: ["**/node_modules/**", "**/dist/**", "src/main.tsx"],
      // 加载环境变量
      env: loadEnv(mode, process.cwd(), ""),
      // 路径别名（与 Vite 配置对齐）
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src"),
        "@/assets": path.resolve(__vite_injected_original_dirname, "./src/assets"),
        "^!!raw-loader!": path.resolve(__vite_injected_original_dirname, "./__mocks__/rawLoaderMock.js")
      },
      // 覆盖率配置
      coverage: {
        // 是否启用收集测试覆盖率
        enabled: true,
        // 覆盖率提供商: v8 | ìstanbul
        provider: "v8",
        reporter: ["text", "json", "clover", "html"],
        // 更改默认覆盖文件夹位置
        // reportsDirectory: './coverage',
        // 是否在重新运行时清除覆盖率数据
        cleanOnRerun: true,
        // 是否在失败时也生成覆盖率报告
        reportOnFailure: true,
        // 是否在运行测试时收集覆盖率数据
        excludeNodeModules: true,
        // 包含和排除的文件
        include: ["src/**/*.{ts,tsx}"],
        exclude: ["**/*.d.ts", "**/*.stories.tsx", "src/__tests__/**", "src/mocks/**"],
        // 覆盖阈值
        thresholds: {
          // 设置每个文件的阈值
          lines: 80,
          // 设置每个函数的阈值
          functions: 75,
          // 设置每个分支的阈值
          branches: 80,
          // 设置每个语句的阈值
          statements: 80
        }
      }
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
            plugins: ["decorators-legacy", "classProperties"]
          }
        }
      }),
      // 用于在开发过程中提供实时的代码检查和错误报告。它集成了多种检查工具，如 TypeScript、VLS (Vetur Language Server)、ESLint、Stylelint 等，帮助开发者在开发阶段就能发现和修复代码中的问题。
      checker({
        typescript: true
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: VITE_TITLE
            // 动态注入标题
          }
        }
      }),
      // 用于 CSS-in-JS 解决方案的插件
      vanillaExtractPlugin({
        identifiers: ({ debugId }) => `${debugId}`
      }),
      // 配置 tsconfig 路径插件，以支持 TypeScript 路径别名
      tsconfigPaths(),
      // 配置 SVG 图标插件，用于处理 SVG 图标
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]"
      }),
      // 生产环境下的打包分析插件，生成打包报告
      isProduction && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: "treemap"
        // 使用树形图更直观
      })
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
            "vendor-charts": ["apexcharts", "react-apexcharts"]
          }
        }
      }
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: ["react", "react-dom", "react-router", "antd", "@ant-design/icons", "axios", "dayjs"],
      exclude: ["@iconify/react"]
      // 排除不需要预构建的依赖
    },
    // esbuild 优化配置
    esbuild: {
      // 在生产环境下移除 console 和 debugger 语句
      drop: isProduction ? ["console", "debugger"] : [],
      // 移除法律声明注释
      legalComments: "none",
      // 设置构建目标为 esnext
      target: "esnext"
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0XFxcXEdpdEh1YlxcXFxzbGFzaC1hZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxccHJvamVjdFxcXFxHaXRIdWJcXFxcc2xhc2gtYWRtaW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3Byb2plY3QvR2l0SHViL3NsYXNoLWFkbWluL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3QvY29uZmlnXCIgLz5cbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuXG5pbXBvcnQgeyB2YW5pbGxhRXh0cmFjdFBsdWdpbiB9IGZyb20gJ0B2YW5pbGxhLWV4dHJhY3Qvdml0ZS1wbHVnaW4nO1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcic7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCBjaGVja2VyIGZyb20gJ3ZpdGUtcGx1Z2luLWNoZWNrZXInO1xuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWh0bWwnO1xuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XG4vLyBpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlc3QvY29uZmlnJztcbi8vIGltcG9ydCB7IGNvbmZpZ0RlZmF1bHRzIH0gZnJvbSAndml0ZXN0L2NvbmZpZy5qcyc7XG5cbi8vIC4uLiBleGlzdGluZyBpbXBvcnRzIC4uLlxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG5cdC8vIFx1NTJBMFx1OEY3RFx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlxuXHRjb25zdCB7IFZJVEVfUE9SVCwgVklURV9USVRMRSwgVklURV9BUFBfQkFTRV9QQVRILCBWSVRFX0xPQ0FMX0FQSV9VUkwgfSA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuXHRjb25zdCBiYXNlID0gVklURV9BUFBfQkFTRV9QQVRIIHx8ICcvJztcblx0Y29uc3QgaXNQcm9kdWN0aW9uID0gbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nO1xuXG5cdHJldHVybiB7XG5cdFx0Ly8gXHU1N0ZBXHU3ODQwXHU4REVGXHU1Rjg0XG5cdFx0YmFzZSxcblxuXHRcdC8vIFx1NUYwMFx1NTNEMVx1NjcwRFx1NTJBMVx1NTY2OFx1OTE0RFx1N0Y2RVxuXHRcdHNlcnZlcjoge1xuXHRcdFx0b3BlbjogdHJ1ZSxcblx0XHRcdGhvc3Q6IHRydWUsXG5cdFx0XHRwb3J0OiBOdW1iZXIoVklURV9QT1JUKSB8fCAzMDAxLFxuXHRcdFx0cHJveHk6IHtcblx0XHRcdFx0Jy9hcGknOiB7XG5cdFx0XHRcdFx0Ly8gdGFyZ2V0OiBlbnYuVklURV9BUElfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnLFxuXHRcdFx0XHRcdHRhcmdldDogVklURV9MT0NBTF9BUElfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnLFxuXHRcdFx0XHRcdGNoYW5nZU9yaWdpbjogdHJ1ZSxcblx0XHRcdFx0XHQvLyByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxuXHRcdFx0XHRcdHNlY3VyZTogZmFsc2UsXG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdH0sXG5cblx0XHQvLyBcdTZENEJcdThCRDVcdTc1MjhcdTRGOEJcdTkxNERcdTdGNkVcblx0XHR0ZXN0OiB7XG5cdFx0XHQvLyBcdTU0MkZcdTc1MjhcdTUxNjhcdTVDNDBcdTUzRDhcdTkxQ0Zcblx0XHRcdGdsb2JhbHM6IHRydWUsXG5cdFx0XHQvLyBcdThCQkVcdTdGNkVcdTZENEJcdThCRDVcdTczQUZcdTU4ODNcdTRFM0EganNkb20gfCBoYXBweS1kb21cblx0XHRcdGVudmlyb25tZW50OiAnanNkb20nLFxuXHRcdFx0Ly8gXHU2MzA3XHU1QjlBXHU2RDRCXHU4QkQ1XHU1MjREXHU3Njg0XHU4QkJFXHU3RjZFXHU2NTg3XHU0RUY2XG5cdFx0XHRzZXR1cEZpbGVzOiAnc3JjL19fdGVzdHNfXy92aXRlc3Quc2V0dXAudHMnLFxuXHRcdFx0Ly8gXHU1MzA1XHU1NDJCXHU3Njg0XHU2RDRCXHU4QkQ1XHU2NTg3XHU0RUY2XHU4REVGXHU1Rjg0XG5cdFx0XHRpbmNsdWRlOiBbJ3NyYy9fX3Rlc3RzX18vKiovKi50ZXN0Lnt0cyx0c3h9J10sXG5cdFx0XHQvLyBcdTYzOTJcdTk2NjRcdTc2ODRcdTZENEJcdThCRDVcdTY1ODdcdTRFRjZcdThERUZcdTVGODRcblx0XHRcdGV4Y2x1ZGU6IFsnKiovbm9kZV9tb2R1bGVzLyoqJywgJyoqL2Rpc3QvKionLCAnc3JjL21haW4udHN4J10sXG5cblx0XHRcdC8vIFx1NTJBMFx1OEY3RFx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlxuXHRcdFx0ZW52OiBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKSxcblxuXHRcdFx0Ly8gXHU4REVGXHU1Rjg0XHU1MjJCXHU1NDBEXHVGRjA4XHU0RTBFIFZpdGUgXHU5MTREXHU3RjZFXHU1QkY5XHU5RjUwXHVGRjA5XG5cdFx0XHRhbGlhczoge1xuXHRcdFx0XHQnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuXHRcdFx0XHQnQC9hc3NldHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvYXNzZXRzJyksXG5cdFx0XHRcdCdeISFyYXctbG9hZGVyISc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL19fbW9ja3NfXy9yYXdMb2FkZXJNb2NrLmpzJyksXG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBcdTg5ODZcdTc2RDZcdTczODdcdTkxNERcdTdGNkVcblx0XHRcdGNvdmVyYWdlOiB7XG5cdFx0XHRcdC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOFx1NjUzNlx1OTZDNlx1NkQ0Qlx1OEJENVx1ODk4Nlx1NzZENlx1NzM4N1xuXHRcdFx0XHRlbmFibGVkOiB0cnVlLFxuXHRcdFx0XHQvLyBcdTg5ODZcdTc2RDZcdTczODdcdTYzRDBcdTRGOUJcdTU1NDY6IHY4IHwgXHUwMEVDc3RhbmJ1bFxuXHRcdFx0XHRwcm92aWRlcjogJ3Y4Jyxcblx0XHRcdFx0cmVwb3J0ZXI6IFsndGV4dCcsICdqc29uJywgJ2Nsb3ZlcicsICdodG1sJ10sXG5cdFx0XHRcdC8vIFx1NjZGNFx1NjUzOVx1OUVEOFx1OEJBNFx1ODk4Nlx1NzZENlx1NjU4N1x1NEVGNlx1NTkzOVx1NEY0RFx1N0Y2RVxuXHRcdFx0XHQvLyByZXBvcnRzRGlyZWN0b3J5OiAnLi9jb3ZlcmFnZScsXG5cdFx0XHRcdC8vIFx1NjYyRlx1NTQyNlx1NTcyOFx1OTFDRFx1NjVCMFx1OEZEMFx1ODg0Q1x1NjVGNlx1NkUwNVx1OTY2NFx1ODk4Nlx1NzZENlx1NzM4N1x1NjU3MFx1NjM2RVxuXHRcdFx0XHRjbGVhbk9uUmVydW46IHRydWUsXG5cdFx0XHRcdC8vIFx1NjYyRlx1NTQyNlx1NTcyOFx1NTkzMVx1OEQyNVx1NjVGNlx1NEU1Rlx1NzUxRlx1NjIxMFx1ODk4Nlx1NzZENlx1NzM4N1x1NjJBNVx1NTQ0QVxuXHRcdFx0XHRyZXBvcnRPbkZhaWx1cmU6IHRydWUsXG5cdFx0XHRcdC8vIFx1NjYyRlx1NTQyNlx1NTcyOFx1OEZEMFx1ODg0Q1x1NkQ0Qlx1OEJENVx1NjVGNlx1NjUzNlx1OTZDNlx1ODk4Nlx1NzZENlx1NzM4N1x1NjU3MFx1NjM2RVxuXHRcdFx0XHRleGNsdWRlTm9kZU1vZHVsZXM6IHRydWUsXG5cdFx0XHRcdC8vIFx1NTMwNVx1NTQyQlx1NTQ4Q1x1NjM5Mlx1OTY2NFx1NzY4NFx1NjU4N1x1NEVGNlxuXHRcdFx0XHRpbmNsdWRlOiBbJ3NyYy8qKi8qLnt0cyx0c3h9J10sXG5cdFx0XHRcdGV4Y2x1ZGU6IFsnKiovKi5kLnRzJywgJyoqLyouc3Rvcmllcy50c3gnLCAnc3JjL19fdGVzdHNfXy8qKicsICdzcmMvbW9ja3MvKionXSxcblx0XHRcdFx0Ly8gXHU4OTg2XHU3NkQ2XHU5NjA4XHU1MDNDXG5cdFx0XHRcdHRocmVzaG9sZHM6IHtcblx0XHRcdFx0XHQvLyBcdThCQkVcdTdGNkVcdTZCQ0ZcdTRFMkFcdTY1ODdcdTRFRjZcdTc2ODRcdTk2MDhcdTUwM0Ncblx0XHRcdFx0XHRsaW5lczogODAsXG5cdFx0XHRcdFx0Ly8gXHU4QkJFXHU3RjZFXHU2QkNGXHU0RTJBXHU1MUZEXHU2NTcwXHU3Njg0XHU5NjA4XHU1MDNDXG5cdFx0XHRcdFx0ZnVuY3Rpb25zOiA3NSxcblx0XHRcdFx0XHQvLyBcdThCQkVcdTdGNkVcdTZCQ0ZcdTRFMkFcdTUyMDZcdTY1MkZcdTc2ODRcdTk2MDhcdTUwM0Ncblx0XHRcdFx0XHRicmFuY2hlczogODAsXG5cdFx0XHRcdFx0Ly8gXHU4QkJFXHU3RjZFXHU2QkNGXHU0RTJBXHU4QkVEXHU1M0U1XHU3Njg0XHU5NjA4XHU1MDNDXG5cdFx0XHRcdFx0c3RhdGVtZW50czogODAsXG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBcdTkxNERcdTdGNkVcdTczQUZcdTU4ODNcdTkwMDlcdTk4Nzlcblx0XHRcdC8vIGVudmlyb25tZW50T3B0aW9uczoge1xuXHRcdFx0Ly8gXHRyZXNvdXJjZXM6ICd1c2FibGUnLFxuXHRcdFx0Ly8gfSxcblxuXHRcdFx0Ly8gXHU0RjlEXHU4RDU2XHU1OTA0XHU3NDA2XG5cdFx0XHQvLyBkZXBzOiB7XG5cdFx0XHQvLyBcdGlubGluZTogWydAdmFuaWxsYS1leHRyYWN0L2NzcycsICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnLCAncmVhY3QtaGVsbWV0LWFzeW5jJ10sXG5cdFx0XHQvLyBcdGV4dGVybmFsOiBbJyoqL25vZGVfbW9kdWxlcy8qKiddLFxuXHRcdFx0Ly8gfSxcblxuXHRcdFx0Ly8gXHU2RDRCXHU4QkQ1XHU2NzBEXHU1MkExXHU1NjY4XG5cdFx0XHQvLyBzZXJ2ZXI6IHtcblx0XHRcdC8vIFx0ZGVwczoge1xuXHRcdFx0Ly8gXHRcdGZhbGxiYWNrQ0pTOiB0cnVlLFxuXHRcdFx0Ly8gXHR9LFxuXHRcdFx0Ly8gfSxcblxuXHRcdFx0Ly8gXHU4MUVBXHU1QjlBXHU0RTQ5XHU5MTREXHU3RjZFXG5cdFx0XHQvLyBjc3M6IHtcblx0XHRcdC8vIFx0bW9kdWxlczoge1xuXHRcdFx0Ly8gXHRcdGxvY2Fsc0NvbnZlbnRpb246ICdzdGFibGUnIHwgJ3Njb3BlZCcgfCAnbm9uLXNjb3BlZCdcblx0XHRcdC8vIFx0fSxcblx0XHRcdC8vIH0sXG5cblx0XHRcdC8vIFx1OEY5M1x1NTFGQVx1OTE0RFx1N0Y2RVxuXHRcdFx0Ly8gcmVwb3J0ZXJzOiBbJ2RlZmF1bHQnLCAnaHRtbCddLFxuXHRcdFx0Ly8gLy8gXHU5MTREXHU3RjZFXHU2RDRCXHU4QkQ1XHU2MkE1XHU1NDRBXHU4RjkzXHU1MUZBXHU2NTg3XHU0RUY2XG5cdFx0XHQvLyBvdXRwdXRGaWxlOiB7XG5cdFx0XHQvLyBcdGh0bWw6ICcuL3Rlc3QtcmVzdWx0cy9pbmRleC5odG1sJyxcblx0XHRcdC8vIH0sXG5cblx0XHRcdC8vIFRTXHU3QzdCXHU1NzhCXHU2OEMwXHU2N0U1XG5cdFx0XHQvLyB0eXBlY2hlY2s6IHtcblx0XHRcdC8vIFx0ZW5hYmxlZDogdHJ1ZSxcblx0XHRcdC8vIFx0aW5jbHVkZTogWydzcmMvKiovKi50ZXN0Lnt0cyx0c3h9J10sXG5cdFx0XHQvLyB9LFxuXHRcdH0sXG5cblx0XHQvLyBcdTYzRDJcdTRFRjZcdTkxNERcdTdGNkVcblx0XHRwbHVnaW5zOiBbXG5cdFx0XHQvLyBcdTZERkJcdTUyQTAgUmVhY3QgXHU2M0QyXHU0RUY2XHU3Njg0XHU0RjE4XHU1MzE2XHU5MTREXHU3RjZFLFx1NkRGQlx1NTJBMCBCYWJlbCBcdTYzRDJcdTRFRjZcdTRFRTVcdTY1MkZcdTYzMDFcdTg4QzVcdTk5NzBcdTU2NjhcdTU0OENcdTdDN0JcdTVDNUVcdTYwMjdcblx0XHRcdHJlYWN0KHtcblx0XHRcdFx0YmFiZWw6IHtcblx0XHRcdFx0XHRwYXJzZXJPcHRzOiB7XG5cdFx0XHRcdFx0XHRwbHVnaW5zOiBbJ2RlY29yYXRvcnMtbGVnYWN5JywgJ2NsYXNzUHJvcGVydGllcyddLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0sXG5cdFx0XHR9KSxcblx0XHRcdC8vIFx1NzUyOFx1NEU4RVx1NTcyOFx1NUYwMFx1NTNEMVx1OEZDN1x1N0EwQlx1NEUyRFx1NjNEMFx1NEY5Qlx1NUI5RVx1NjVGNlx1NzY4NFx1NEVFM1x1NzgwMVx1NjhDMFx1NjdFNVx1NTQ4Q1x1OTUxOVx1OEJFRlx1NjJBNVx1NTQ0QVx1MzAwMlx1NUI4M1x1OTZDNlx1NjIxMFx1NEU4Nlx1NTkxQVx1NzlDRFx1NjhDMFx1NjdFNVx1NURFNVx1NTE3N1x1RkYwQ1x1NTk4MiBUeXBlU2NyaXB0XHUzMDAxVkxTIChWZXR1ciBMYW5ndWFnZSBTZXJ2ZXIpXHUzMDAxRVNMaW50XHUzMDAxU3R5bGVsaW50IFx1N0I0OVx1RkYwQ1x1NUUyRVx1NTJBOVx1NUYwMFx1NTNEMVx1ODAwNVx1NTcyOFx1NUYwMFx1NTNEMVx1OTYzNlx1NkJCNVx1NUMzMVx1ODBGRFx1NTNEMVx1NzNCMFx1NTQ4Q1x1NEZFRVx1NTkwRFx1NEVFM1x1NzgwMVx1NEUyRFx1NzY4NFx1OTVFRVx1OTg5OFx1MzAwMlxuXHRcdFx0Y2hlY2tlcih7XG5cdFx0XHRcdHR5cGVzY3JpcHQ6IHRydWUsXG5cdFx0XHR9KSxcblx0XHRcdGNyZWF0ZUh0bWxQbHVnaW4oe1xuXHRcdFx0XHRpbmplY3Q6IHtcblx0XHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0XHR0aXRsZTogVklURV9USVRMRSwgLy8gXHU1MkE4XHU2MDAxXHU2Q0U4XHU1MTY1XHU2ODA3XHU5ODk4XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSxcblx0XHRcdH0pLFxuXHRcdFx0Ly8gXHU3NTI4XHU0RThFIENTUy1pbi1KUyBcdTg5RTNcdTUxQjNcdTY1QjlcdTY4NDhcdTc2ODRcdTYzRDJcdTRFRjZcblx0XHRcdHZhbmlsbGFFeHRyYWN0UGx1Z2luKHtcblx0XHRcdFx0aWRlbnRpZmllcnM6ICh7IGRlYnVnSWQgfSkgPT4gYCR7ZGVidWdJZH1gLFxuXHRcdFx0fSksXG5cdFx0XHQvLyBcdTkxNERcdTdGNkUgdHNjb25maWcgXHU4REVGXHU1Rjg0XHU2M0QyXHU0RUY2XHVGRjBDXHU0RUU1XHU2NTJGXHU2MzAxIFR5cGVTY3JpcHQgXHU4REVGXHU1Rjg0XHU1MjJCXHU1NDBEXG5cdFx0XHR0c2NvbmZpZ1BhdGhzKCksXG5cdFx0XHQvLyBcdTkxNERcdTdGNkUgU1ZHIFx1NTZGRVx1NjgwN1x1NjNEMlx1NEVGNlx1RkYwQ1x1NzUyOFx1NEU4RVx1NTkwNFx1NzQwNiBTVkcgXHU1NkZFXHU2ODA3XG5cdFx0XHRjcmVhdGVTdmdJY29uc1BsdWdpbih7XG5cdFx0XHRcdGljb25EaXJzOiBbcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMvYXNzZXRzL2ljb25zJyldLFxuXHRcdFx0XHRzeW1ib2xJZDogJ2ljb24tW2Rpcl0tW25hbWVdJyxcblx0XHRcdH0pLFxuXHRcdFx0Ly8gXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU0RTBCXHU3Njg0XHU2MjUzXHU1MzA1XHU1MjA2XHU2NzkwXHU2M0QyXHU0RUY2XHVGRjBDXHU3NTFGXHU2MjEwXHU2MjUzXHU1MzA1XHU2MkE1XHU1NDRBXG5cdFx0XHRpc1Byb2R1Y3Rpb24gJiZcblx0XHRcdFx0dmlzdWFsaXplcih7XG5cdFx0XHRcdFx0b3BlbjogdHJ1ZSxcblx0XHRcdFx0XHRnemlwU2l6ZTogdHJ1ZSxcblx0XHRcdFx0XHRicm90bGlTaXplOiB0cnVlLFxuXHRcdFx0XHRcdHRlbXBsYXRlOiAndHJlZW1hcCcsIC8vIFx1NEY3Rlx1NzUyOFx1NjgxMVx1NUY2Mlx1NTZGRVx1NjZGNFx1NzZGNFx1ODlDMlxuXHRcdFx0XHR9KSxcblx0XHRdLmZpbHRlcihCb29sZWFuKSxcblxuXHRcdC8vIFx1Njc4NFx1NUVGQVx1OTE0RFx1N0Y2RVxuXHRcdGJ1aWxkOiB7XG5cdFx0XHQvLyBcdThCQkVcdTdGNkVcdTY3ODRcdTVFRkFcdTc2RUVcdTY4MDdcblx0XHRcdHRhcmdldDogJ2VzbmV4dCcsXG5cdFx0XHQvLyBcdTRGN0ZcdTc1MjggZXNidWlsZCBcdThGREJcdTg4NENcdTRFRTNcdTc4MDFcdTUzOEJcdTdGMjlcblx0XHRcdG1pbmlmeTogJ2VzYnVpbGQnLFxuXHRcdFx0Ly8gXHU1NzI4XHU5NzVFXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU0RTBCXHU3NTFGXHU2MjEwXHU2RTkwXHU3ODAxXHU2NjIwXHU1QzA0XG5cdFx0XHRzb3VyY2VtYXA6ICFpc1Byb2R1Y3Rpb24sXG5cdFx0XHQvLyBcdTU0MkZcdTc1MjggQ1NTIFx1NEVFM1x1NzgwMVx1NTIwNlx1NTI3MlxuXHRcdFx0Y3NzQ29kZVNwbGl0OiB0cnVlLFxuXHRcdFx0Ly8gXHU4QkJFXHU3RjZFXHU1NzU3XHU1OTI3XHU1QzBGXHU4QjY2XHU1NDRBXHU5NjUwXHU1MjM2XG5cdFx0XHRjaHVua1NpemVXYXJuaW5nTGltaXQ6IDE1MDAsXG5cdFx0XHQvLyBcdTkxNERcdTdGNkUgUm9sbHVwIFx1OTAwOVx1OTg3OVx1RkYwQ1x1NjI0Qlx1NTJBOFx1NTIwNlx1NTI3Mlx1NEVFM1x1NzgwMVx1NTc1N1xuXHRcdFx0cm9sbHVwT3B0aW9uczoge1xuXHRcdFx0XHRvdXRwdXQ6IHtcblx0XHRcdFx0XHRtYW51YWxDaHVua3M6IHtcblx0XHRcdFx0XHRcdCd2ZW5kb3ItY29yZSc6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlciddLFxuXHRcdFx0XHRcdFx0J3ZlbmRvci11aSc6IFsnYW50ZCcsICdAYW50LWRlc2lnbi9pY29ucycsICdAYW50LWRlc2lnbi9jc3NpbmpzJywgJ2ZyYW1lci1tb3Rpb24nLCAnc3R5bGVkLWNvbXBvbmVudHMnXSxcblx0XHRcdFx0XHRcdCd2ZW5kb3ItdXRpbHMnOiBbJ2F4aW9zJywgJ2RheWpzJywgJ2kxOG5leHQnLCAnenVzdGFuZCcsICdAaWNvbmlmeS9yZWFjdCddLFxuXHRcdFx0XHRcdFx0J3ZlbmRvci1jaGFydHMnOiBbJ2FwZXhjaGFydHMnLCAncmVhY3QtYXBleGNoYXJ0cyddLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdH0sXG5cblx0XHQvLyBcdTRGMThcdTUzMTZcdTRGOURcdThENTZcdTk4ODRcdTY3ODRcdTVFRkFcblx0XHRvcHRpbWl6ZURlcHM6IHtcblx0XHRcdGluY2x1ZGU6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlcicsICdhbnRkJywgJ0BhbnQtZGVzaWduL2ljb25zJywgJ2F4aW9zJywgJ2RheWpzJ10sXG5cdFx0XHRleGNsdWRlOiBbJ0BpY29uaWZ5L3JlYWN0J10sIC8vIFx1NjM5Mlx1OTY2NFx1NEUwRFx1OTcwMFx1ODk4MVx1OTg4NFx1Njc4NFx1NUVGQVx1NzY4NFx1NEY5RFx1OEQ1NlxuXHRcdH0sXG5cblx0XHQvLyBlc2J1aWxkIFx1NEYxOFx1NTMxNlx1OTE0RFx1N0Y2RVxuXHRcdGVzYnVpbGQ6IHtcblx0XHRcdC8vIFx1NTcyOFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NEUwQlx1NzlGQlx1OTY2NCBjb25zb2xlIFx1NTQ4QyBkZWJ1Z2dlciBcdThCRURcdTUzRTVcblx0XHRcdGRyb3A6IGlzUHJvZHVjdGlvbiA/IFsnY29uc29sZScsICdkZWJ1Z2dlciddIDogW10sXG5cdFx0XHQvLyBcdTc5RkJcdTk2NjRcdTZDRDVcdTVGOEJcdTU4RjBcdTY2MEVcdTZDRThcdTkxQ0Fcblx0XHRcdGxlZ2FsQ29tbWVudHM6ICdub25lJyxcblx0XHRcdC8vIFx1OEJCRVx1N0Y2RVx1Njc4NFx1NUVGQVx1NzZFRVx1NjgwN1x1NEUzQSBlc25leHRcblx0XHRcdHRhcmdldDogJ2VzbmV4dCcsXG5cdFx0fSxcblx0fTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLE9BQU8sVUFBVTtBQUNqQixPQUFPLFdBQVc7QUFFbEIsU0FBUyw0QkFBNEI7QUFDckMsU0FBUyxrQkFBa0I7QUFDM0IsU0FBUyxjQUFjLGVBQWU7QUFDdEMsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsd0JBQXdCO0FBQ2pDLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sbUJBQW1CO0FBVjFCLElBQU0sbUNBQW1DO0FBZ0J6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUV6QyxRQUFNLEVBQUUsV0FBVyxZQUFZLG9CQUFvQixtQkFBbUIsSUFBSSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUN6RyxRQUFNLE9BQU8sc0JBQXNCO0FBQ25DLFFBQU0sZUFBZSxTQUFTO0FBRTlCLFNBQU87QUFBQTtBQUFBLElBRU47QUFBQTtBQUFBLElBR0EsUUFBUTtBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTSxPQUFPLFNBQVMsS0FBSztBQUFBLE1BQzNCLE9BQU87QUFBQSxRQUNOLFFBQVE7QUFBQTtBQUFBLFVBRVAsUUFBUSxzQkFBc0I7QUFBQSxVQUM5QixjQUFjO0FBQUE7QUFBQSxVQUVkLFFBQVE7QUFBQSxRQUNUO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQTtBQUFBLElBR0EsTUFBTTtBQUFBO0FBQUEsTUFFTCxTQUFTO0FBQUE7QUFBQSxNQUVULGFBQWE7QUFBQTtBQUFBLE1BRWIsWUFBWTtBQUFBO0FBQUEsTUFFWixTQUFTLENBQUMsa0NBQWtDO0FBQUE7QUFBQSxNQUU1QyxTQUFTLENBQUMsc0JBQXNCLGNBQWMsY0FBYztBQUFBO0FBQUEsTUFHNUQsS0FBSyxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUFBO0FBQUEsTUFHcEMsT0FBTztBQUFBLFFBQ04sS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLFFBQ3BDLFlBQVksS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxRQUNsRCxrQkFBa0IsS0FBSyxRQUFRLGtDQUFXLDhCQUE4QjtBQUFBLE1BQ3pFO0FBQUE7QUFBQSxNQUdBLFVBQVU7QUFBQTtBQUFBLFFBRVQsU0FBUztBQUFBO0FBQUEsUUFFVCxVQUFVO0FBQUEsUUFDVixVQUFVLENBQUMsUUFBUSxRQUFRLFVBQVUsTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBSTNDLGNBQWM7QUFBQTtBQUFBLFFBRWQsaUJBQWlCO0FBQUE7QUFBQSxRQUVqQixvQkFBb0I7QUFBQTtBQUFBLFFBRXBCLFNBQVMsQ0FBQyxtQkFBbUI7QUFBQSxRQUM3QixTQUFTLENBQUMsYUFBYSxvQkFBb0Isb0JBQW9CLGNBQWM7QUFBQTtBQUFBLFFBRTdFLFlBQVk7QUFBQTtBQUFBLFVBRVgsT0FBTztBQUFBO0FBQUEsVUFFUCxXQUFXO0FBQUE7QUFBQSxVQUVYLFVBQVU7QUFBQTtBQUFBLFVBRVYsWUFBWTtBQUFBLFFBQ2I7QUFBQSxNQUNEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBdUNEO0FBQUE7QUFBQSxJQUdBLFNBQVM7QUFBQTtBQUFBLE1BRVIsTUFBTTtBQUFBLFFBQ0wsT0FBTztBQUFBLFVBQ04sWUFBWTtBQUFBLFlBQ1gsU0FBUyxDQUFDLHFCQUFxQixpQkFBaUI7QUFBQSxVQUNqRDtBQUFBLFFBQ0Q7QUFBQSxNQUNELENBQUM7QUFBQTtBQUFBLE1BRUQsUUFBUTtBQUFBLFFBQ1AsWUFBWTtBQUFBLE1BQ2IsQ0FBQztBQUFBLE1BQ0QsaUJBQWlCO0FBQUEsUUFDaEIsUUFBUTtBQUFBLFVBQ1AsTUFBTTtBQUFBLFlBQ0wsT0FBTztBQUFBO0FBQUEsVUFDUjtBQUFBLFFBQ0Q7QUFBQSxNQUNELENBQUM7QUFBQTtBQUFBLE1BRUQscUJBQXFCO0FBQUEsUUFDcEIsYUFBYSxDQUFDLEVBQUUsUUFBUSxNQUFNLEdBQUcsT0FBTztBQUFBLE1BQ3pDLENBQUM7QUFBQTtBQUFBLE1BRUQsY0FBYztBQUFBO0FBQUEsTUFFZCxxQkFBcUI7QUFBQSxRQUNwQixVQUFVLENBQUMsS0FBSyxRQUFRLFFBQVEsSUFBSSxHQUFHLGtCQUFrQixDQUFDO0FBQUEsUUFDMUQsVUFBVTtBQUFBLE1BQ1gsQ0FBQztBQUFBO0FBQUEsTUFFRCxnQkFDQyxXQUFXO0FBQUEsUUFDVixNQUFNO0FBQUEsUUFDTixVQUFVO0FBQUEsUUFDVixZQUFZO0FBQUEsUUFDWixVQUFVO0FBQUE7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNILEVBQUUsT0FBTyxPQUFPO0FBQUE7QUFBQSxJQUdoQixPQUFPO0FBQUE7QUFBQSxNQUVOLFFBQVE7QUFBQTtBQUFBLE1BRVIsUUFBUTtBQUFBO0FBQUEsTUFFUixXQUFXLENBQUM7QUFBQTtBQUFBLE1BRVosY0FBYztBQUFBO0FBQUEsTUFFZCx1QkFBdUI7QUFBQTtBQUFBLE1BRXZCLGVBQWU7QUFBQSxRQUNkLFFBQVE7QUFBQSxVQUNQLGNBQWM7QUFBQSxZQUNiLGVBQWUsQ0FBQyxTQUFTLGFBQWEsY0FBYztBQUFBLFlBQ3BELGFBQWEsQ0FBQyxRQUFRLHFCQUFxQix1QkFBdUIsaUJBQWlCLG1CQUFtQjtBQUFBLFlBQ3RHLGdCQUFnQixDQUFDLFNBQVMsU0FBUyxXQUFXLFdBQVcsZ0JBQWdCO0FBQUEsWUFDekUsaUJBQWlCLENBQUMsY0FBYyxrQkFBa0I7QUFBQSxVQUNuRDtBQUFBLFFBQ0Q7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBO0FBQUEsSUFHQSxjQUFjO0FBQUEsTUFDYixTQUFTLENBQUMsU0FBUyxhQUFhLGdCQUFnQixRQUFRLHFCQUFxQixTQUFTLE9BQU87QUFBQSxNQUM3RixTQUFTLENBQUMsZ0JBQWdCO0FBQUE7QUFBQSxJQUMzQjtBQUFBO0FBQUEsSUFHQSxTQUFTO0FBQUE7QUFBQSxNQUVSLE1BQU0sZUFBZSxDQUFDLFdBQVcsVUFBVSxJQUFJLENBQUM7QUFBQTtBQUFBLE1BRWhELGVBQWU7QUFBQTtBQUFBLE1BRWYsUUFBUTtBQUFBLElBQ1Q7QUFBQSxFQUNEO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
