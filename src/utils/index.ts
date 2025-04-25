import type { MenuOptions } from "@/api/types";
import type { ClassValue } from "clsx";

type EnumObject = Record<string, string | number>;

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isProd() {
	return import.meta.env.MODE === "production";
}

export const getEnumOptions = <T extends EnumObject>(enumObj: T) => {
	return Object.entries(enumObj)
		.filter(([key]) => Number.isNaN(Number(key)))
		.map(([label, value]) => ({
			label,
			value: value as T[keyof T],
		}));
};

/**
 * @description 处理权限，用于 tree 组件展示
 * @param menuTree
 * @param permissions
 * @returns 处理后的权限数组
 */
export function processPermissions(menuTree: MenuOptions[], permissions: number[]): number[] {
	const permissionSet = new Set(permissions);
	const result = new Set<number>();

	// 递归处理节点并返回是否保留该节点
	function walk(nodes: MenuOptions[]): {
		shouldKeep: boolean; // 当前节点是否需要保留
		childCount: number; // 直接子节点总数
		matchedCount: number; // 符合条件的子节点数
	} {
		let childCount = 0;
		let matchedCount = 0;
		let shouldKeep = false;

		for (const node of nodes) {
			// 递归处理子节点
			let childrenStatus = { shouldKeep: false, childCount: 0, matchedCount: 0 };
			if (node.children?.length) {
				childrenStatus = walk(node.children);
			}

			// 当前节点是否被显式选中
			const isExplicitlySelected = permissionSet.has(node.id as number);

			// 叶子节点逻辑
			if (!node.children?.length) {
				if (isExplicitlySelected) {
					result.add(node.id as number);
					shouldKeep = true;
					matchedCount++;
				}
				childCount++;
				continue;
			}

			// 父节点逻辑
			childCount += childrenStatus.childCount;
			const allChildrenMatched = childrenStatus.matchedCount === childrenStatus.childCount;

			// 必须同时满足：显式选中 且 所有子节点都被选中
			if (isExplicitlySelected && allChildrenMatched) {
				result.add(node.id as number);
				matchedCount++;
				shouldKeep = true;
			}

			// 子节点匹配数继承
			matchedCount += childrenStatus.matchedCount;
		}

		return { shouldKeep, childCount, matchedCount };
	}

	walk(menuTree);
	return Array.from(result);
}
