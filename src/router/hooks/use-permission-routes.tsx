import type { MenuOptions } from '@/api/types';
// import type { Permission } from "#/entity";
import type { AppRouteObject } from '#/router';

import { isEmpty } from 'ramda';
import { Suspense, lazy, useMemo } from 'react';
import { Navigate, Outlet } from 'react-router';

import { Iconify } from '@/components/icon';
import { CircleLoading } from '@/components/loading';
import { useUserPermission } from '@/store/userStore';
import { flattenTrees } from '@/utils/tree';

import { Tag } from 'antd';
import { BasicStatus, PermissionType } from '#/enum';
import { getRoutesFromModules } from '../utils';

const ENTRY_PATH = '/src/pages';
// 动态导入所有页面组件
const PAGES = import.meta.glob('/src/pages/**/*.tsx');
// 根据路径加载组件
const loadComponentFromPath = (path: string) => PAGES[`${ENTRY_PATH}${path}`];

/**
 * Build complete route path by traversing from current permission to root
 * @param {MenuOptions} current - current permission
 * @param {MenuOptions[]} permissions - flattened permission array
 * @param {string[]} pathSegments - route segments accumulator
 * @returns {string} normalized complete route path
 */
function buildCompleteRoute(current: MenuOptions, permissions: MenuOptions[], pathSegments: string[] = []): string {
	// Add current route segment
	pathSegments.unshift(current.route);

	// Base case: reached root permission
	if (current.parentId === null) {
		return `/${pathSegments.join('/')}`;
	}

	// Find parent and continue recursion
	const parent = permissions.find((p) => p.id === current.parentId);
	if (!parent) {
		console.warn(`Parent permission not found for ID: ${current.parentId}`);
		return `/${pathSegments.join('/')}`;
	}

	return buildCompleteRoute(parent, permissions, pathSegments);
}

// Components
function NewFeatureTag() {
	return (
		<Tag color="cyan" className="!ml-2">
			<div className="flex items-center gap-1">
				<Iconify icon="solar:bell-bing-bold-duotone" size={12} />
				<span className="ms-1">NEW</span>
			</div>
		</Tag>
	);
}

/**
 * @ddescription Create a base route
 * @param permission
 * @param completeRoute
 * @returns
 */
const createBaseRoute = (permission: MenuOptions, completeRoute: string): AppRouteObject => {
	const { route, label, icon, order, hide, hideTab, status, frameSrc, newFeature } = permission;

	const baseRoute: AppRouteObject = {
		path: route,
		meta: {
			label,
			key: completeRoute,
			hideMenu: !!hide,
			hideTab,
			disabled: status === BasicStatus.DISABLE,
		},
	};

	if (order) baseRoute.order = order;
	if (baseRoute.meta) {
		if (icon) baseRoute.meta.icon = icon;
		if (frameSrc) baseRoute.meta.frameSrc = frameSrc;
		if (newFeature) baseRoute.meta.suffix = <NewFeatureTag />;
	}

	return baseRoute;
};

/**
 * @description Create a catalogue route
 * @param permission
 * @param flattenedPermissions
 * @returns
 */
const createCatalogueRoute = (permission: MenuOptions, flattenedPermissions: MenuOptions[]): AppRouteObject => {
	const baseRoute = createBaseRoute(permission, buildCompleteRoute(permission, flattenedPermissions));

	if (baseRoute.meta) {
		baseRoute.meta.hideTab = true;
	}

	const { parentId, children = [] } = permission;
	if (!parentId) {
		baseRoute.element = (
			<Suspense fallback={<CircleLoading />}>
				<Outlet />
			</Suspense>
		);
	}

	baseRoute.children = transformPermissionsToRoutes(children, flattenedPermissions);

	if (!isEmpty(children)) {
		baseRoute.children.unshift({
			index: true,
			element: <Navigate to={children[0].route} replace />,
		});
	}

	return baseRoute;
};

/**
 * @description Create a menu route
 * @param permission
 * @param flattenedPermissions
 * @returns
 */
const createMenuRoute = (permission: MenuOptions, flattenedPermissions: MenuOptions[]): AppRouteObject => {
	const baseRoute = createBaseRoute(permission, buildCompleteRoute(permission, flattenedPermissions));

	if (permission.component) {
		const Element = lazy(loadComponentFromPath(permission.component) as any);

		if (permission.frameSrc) {
			baseRoute.element = <Element src={permission.frameSrc} />;
		} else {
			baseRoute.element = (
				<Suspense fallback={<CircleLoading />}>
					<Element />
				</Suspense>
			);
		}
	}

	return baseRoute;
};

/**
 * @description Transform permissions to routes
 * @param permissions
 * @param flattenedPermissions
 * @returns
 */
function transformPermissionsToRoutes(
	permissions: MenuOptions[],
	flattenedPermissions: MenuOptions[],
): AppRouteObject[] {
	return permissions.map((permission) => {
		if (permission.type === PermissionType.CATALOGUE) {
			return createCatalogueRoute(permission, flattenedPermissions);
		}
		return createMenuRoute(permission, flattenedPermissions);
	});
}

/**
 * @description Get Rermission Routes
 * @returns
 */
export function usePermissionRoutes() {
	const { VITE_APP_ROUTER_MODE: ROUTE_MODE } = import.meta.env;
	// 使用动态路由
	const permissions = useUserPermission();
	// 使用静态路由
	if (ROUTE_MODE === 'module') {
		return getRoutesFromModules();
	}
	return useMemo(() => {
		if (!permissions) {
			return [];
		}
		const flattenedPermissions = flattenTrees(permissions);
		return transformPermissionsToRoutes(permissions, flattenedPermissions);
	}, [permissions]);
}
