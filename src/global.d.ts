// global.d.ts
declare global {
	// 或声明为顶层常量（根据使用方式选择）
	const __APP_DEPS__: {
		dependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
	};
}

export {}; // 确保文件被视为模块
