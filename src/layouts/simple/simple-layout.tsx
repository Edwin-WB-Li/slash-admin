import Logo from "@/components/logo";

import GlobalSettings from "@/components/global-settings";

export default function HeaderSimple() {
	return (
		<header className="flex h-16 w-full items-center justify-between px-6">
			<Logo size={30} />
			<GlobalSettings />
		</header>
	);
}
