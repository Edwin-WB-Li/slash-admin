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
