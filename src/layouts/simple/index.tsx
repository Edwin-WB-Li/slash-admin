import type React from "react";

import SimpLeLayoutComponent from "./simple-layout";

type Props = {
	children: React.ReactNode;
};
export default function SimpleLayout({ children }: Props) {
	return (
		<div className="flex h-screen w-full flex-col text-text-base bg-bg">
			<SimpLeLayoutComponent />
			{children}
		</div>
	);
}
