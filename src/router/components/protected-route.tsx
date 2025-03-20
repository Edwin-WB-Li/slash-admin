// import { t } from "@/locales/i18n";
import PageError from "@/pages/sys/error/PageError";
import { useUserToken } from "@/store/userStore";
// import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate } from "react-router";
// import { toast } from "sonner";
// import { useRouter } from "../hooks";

type Props = {
  children: React.ReactNode;
};
export default function ProtectedRoute({ children }: Props) {
  // console.log("children", children);
  // const router = useRouter();
  const token = useUserToken();

  // useEffect(() => {
  //   console.log("check token", token);
  //   const timer = setTimeout(() => {
  //     if (!token) {
  //       toast.info(t("common.reLogin") || "login success!", {
  //         position: "top-center",
  //       });
  //       router.replace("/login");
  //     }
  //   }, 200);

  //   return () => clearTimeout(timer);
  // }, [router, token]);

  if (!token) {
    // 直接跳转，无需延迟
    return <Navigate to="/login" replace />;
  }

  return (
    <ErrorBoundary FallbackComponent={PageError}>{children}</ErrorBoundary>
  );
}
