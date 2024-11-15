"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signOut = async () => {
  const c = await cookies();
  c.delete("accessToken");
  redirect("/auth/sign-in");
  return new Response(null, { status: 200, statusText: "OK" });
};
