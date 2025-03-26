import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

vi.mock('@/assets/**/*.{png,png}', () => 'mock-file-stub');
vi.mock('!!raw-loader!./path/to/file', () => 'raw-content');
vi.mock('@/assets/**/*.svg', () => 'svg-mock');

// 全局 DOM 清理
afterEach(() => {
	cleanup();
	document.head.innerHTML = '';
	document.body.innerHTML = '';
});

// Polyfills
if (typeof window.URL.createObjectURL === 'undefined') {
	Object.defineProperty(window.URL, 'createObjectURL', {
		value: () => 'mock-blob-url',
	});
}

// Mock matchMedia
window.matchMedia = (query) => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: vi.fn(),
	removeListener: vi.fn(),
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
	dispatchEvent: vi.fn(),
});

// Mock ResizeObserver
if (typeof ResizeObserver === 'undefined') {
	class ResizeObserver {
		observe = vi.fn();
		unobserve = vi.fn();
		disconnect = vi.fn();
	}
	window.ResizeObserver = ResizeObserver;
}

// Mock 浏览器 API
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		addListener: vi.fn(),
		removeListener: vi.fn(),
	})),
});
