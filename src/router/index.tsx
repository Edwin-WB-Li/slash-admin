import type { RouteObject } from 'react-router';
import type { AppRouteObject } from '#/router';

import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, createHashRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import DashboardLayout from '@/layouts/dashboard';
import PageError from '@/pages/sys/error/PageError';
import Login from '@/pages/sys/login/Login';
import ProtectedRoute from '@/router/components/protected-route';
import { usePermissionRoutes } from '@/router/hooks';
import { ERROR_ROUTE } from '@/router/routes/error-routes';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

// 公共路由
const PUBLIC_ROUTE: AppRouteObject = {
	path: '/login',
	element: (
		<ErrorBoundary FallbackComponent={PageError}>
			<Login />
		</ErrorBoundary>
	),
};

// 未匹配路由
const NO_MATCHED_ROUTE: AppRouteObject = {
	path: '*',
	element: <Navigate to="/404" replace />,
};

export default function Router() {
	// 权限路由
	const permissionRoutes = usePermissionRoutes();
	console.log('permissionRoutes-->4', permissionRoutes);

	// 受保护路由
	const PROTECTED_ROUTE: AppRouteObject = {
		path: '/',
		element: (
			<ProtectedRoute>
				<DashboardLayout />
			</ProtectedRoute>
		),
		children: [
			// 接口返回的权限路由
			{ index: true, element: <Navigate to={HOMEPAGE} replace /> },
			// {
			//   children: [
			//     { index: true, element: "xxx" },
			//     {
			//       path: "workbench",
			//       meta: {
			//         disabled: false,
			//         hideMenu: false,
			//         hideTab: true,
			//         icon: "ic-analysis",
			//         key: "/dashboard",
			//         label: "sys.menu.dashboard",
			//       },
			//       order: 1,
			//       element: "xxx",
			//     },
			//     {
			//       path: "analysis",
			//       meta: {
			//         disabled: false,
			//         hideMenu: false,
			//         hideTab: true,
			//         icon: "ic-analysis",
			//         key: "/dashboard",
			//         label: "sys.menu.dashboard",
			//       },
			//       order: 2,
			//       element: "xxx",
			//     },
			//   ],
			//   element: "xxxx",
			//   meta: {
			//     disabled: false,
			//     hideMenu: false,
			//     hideTab: true,
			//     icon: "ic-analysis",
			//     key: "/dashboard",
			//     label: "sys.menu.dashboard",
			//   },
			//   order: 1,
			//   path: "dashboard",
			// },
			...permissionRoutes,
		],
	};

	const routes = [PUBLIC_ROUTE, PROTECTED_ROUTE, ERROR_ROUTE, NO_MATCHED_ROUTE] as RouteObject[];

	const router = createHashRouter(routes);

	return <RouterProvider router={router} />;
}
