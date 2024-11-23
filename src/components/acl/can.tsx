import { useAuthStore } from "@/app/auth/_store/auth";

export function Can({
  children,
  action,
}: {
  children: React.ReactNode;
  action: string;
}) {
  const permissions = useAuthStore((state) => state.permissions);

  if (permissions.includes("*")) {
    return <>{children}</>;
  }

  if (!permissions.includes(action)) {
    return null;
  }

  return <>{children}</>;
}
