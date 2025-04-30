import App from "@/App";
// import { SvgIcon } from '@/components/icon';
import { render, waitFor } from "@testing-library/react";
// import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
const { VITE_TITLE } = import.meta.env;
// Mock 静态资源
vi.mock("@/assets/images/logo.png", () => ({ default: "test-logo-path" }));

// Mock 动态加载组件
vi.mock("./components/animate/motion-lazy", () => ({
	MotionLazy: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock 路由组件
vi.mock("@/router/index", () => ({
	default: () => <div data-testid="router-content">Router Content</div>,
}));

// Mock 主题适配器
vi.mock("./theme/adapter/antd.adapter", () => ({
	AntdAdapter: vi.fn(),
}));

describe("App Component", () => {
	beforeAll(() => {
		// 解决 Ant Design 的 scrollTo 警告
		window.HTMLElement.prototype.scrollTo = vi.fn();
	});

	beforeEach(() => {
		// 重置 Helmet 状态
		document.head.innerHTML = "";
	});

	const renderApp = () =>
		render(
			<HelmetProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</HelmetProvider>,
		);

	it("应正确设置页面元信息", async () => {
		renderApp();

		await waitFor(
			() => {
				// 验证标题
				expect(document.title).toBe(VITE_TITLE);
				// 验证图标
				// const favicon = document.querySelector('link[rel="icon"]');
				// expect(favicon).toHaveAttribute("href", "test-logo-path");
			},
			{ timeout: 2000 },
		);
	});

	// it('Render SvgIcon Component', async () => {
	// 	render(<SvgIcon icon="solar:bell-bing-bold-duotone" size={24} />);
	// 	const svgIcon = screen.getByTestId('svg-icon');
	// 	expect(svgIcon).toBeInTheDocument();
	// });

	// it('应渲染核心功能组件', () => {
	// 	const { container } = renderApp();

	// 	// 验证主题容器
	// 	expect(container.querySelector('.ant-app')).toBeInTheDocument();

	// 	// 验证路由内容
	// 	expect(screen.getByTestId('router-content')).toBeInTheDocument();

	// 	// 验证 Toast 容器
	// 	expect(screen.getByRole('alert')).toBeInTheDocument();
	// });

	// it('应正确处理主题适配器', async () => {
	// 	const AntdAdapter = vi.mocked(await import('@/theme/adapter/antd.adapter'));
	// 	renderApp();

	// 	expect(AntdAdapter.AntdAdapter).toHaveBeenCalled();
	// });
});
