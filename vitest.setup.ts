import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { afterEach, vi } from 'vitest';

vi.mock('@/assets/**/*.{png,png}', () => 'mock-file-stub');
vi.mock('!!raw-loader!./path/to/file', () => 'raw-content');
vi.mock('@/assets/**/*.svg', () => 'svg-mock');

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key, // 返回 key 本身
		i18n: {
			changeLanguage: vi.fn(),
		},
	}),
	Trans: ({ children }: { children: React.ReactNode }) => children,
	initReactI18next: {
		type: '3rdParty',
		init: vi.fn(),
	},
}));

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

i18n.use(initReactI18next).init({
	lng: 'en', // 默认语言
	fallbackLng: 'en', // 回退语言
	resources: {
		en: {
			translation: {
				// 添加你的翻译内容
				'Slash Admin': 'Slash Admin',
			},
		},
	},
	interpolation: {
		escapeValue: false, // 不转义 HTML
	},
});

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
