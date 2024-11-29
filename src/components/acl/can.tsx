import { useAuthStore } from "@/app/auth/_store/auth";

export function Can({
  children,
  action,
  fallback,
}: {
  children: React.ReactNode;
  action: string;
  fallback?: React.ReactNode;
}) {
  const permissions = useAuthStore((state) => state.permissions);

  if (permissions.includes("*")) {
    return <>{children}</>;
  }

  if (!permissions.includes(action)) {
    if (fallback) {
      return fallback;
    }
    return null;
  }

  return <>{children}</>;
}
