import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Log in — Blitzz Academy" };

export default async function LoginPage({ searchParams }) {
  const user = await getSessionUser().catch(() => null);
  const next = typeof searchParams?.next === "string" ? searchParams.next : "";
  if (user) redirect(next.startsWith("/") ? next : "/dashboard");
  return <LoginForm next={next} />;
}
