"use server";
import { redirect } from "next/navigation";

export default async function Page() {
  redirect("/auth/sign-in");
  return <div>Sign out</div>;
}
