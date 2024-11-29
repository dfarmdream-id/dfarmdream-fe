import { useGetProfile } from "@/app/(authenticated)/_services/profile";
import { useAuthStore } from "@/app/auth/_store/auth";

export function Can({
  children,
  action,
  fallback,
  loader,
}: {
  children: React.ReactNode;
  action: string;
  fallback?: React.ReactNode;
  loader?: React.ReactNode;
}) {
  const { isPending } = useGetProfile();

  const permissions = useAuthStore((state) => state.permissions);
  if (isPending) return loader;

  if (permissions.includes("*")) {
    return <>{children}</>;
  }

  if (!permissions.includes(action)) {
    if (fallback && !isPending) {
      return fallback;
    }
    return null;
  }

  return <>{children}</>;
}
