import { ErrorBoundary } from "react-error-boundary";
import { Navigate } from "react-router";

import PageError from "@/pages/sys/error/PageError";
import { useUserToken } from "@/store/userStore";

type Props = {
	children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
	const token = useUserToken();
	if (!token) {
		return <Navigate to="/login" replace />;
	}

	return (
		<ErrorBoundary
			FallbackComponent={PageError}
			onError={(error, info) => {
				console.error("ErrorBoundary 捕获的错误:", error, info);
			}}
		>
			{children}
		</ErrorBoundary>
	);
}
