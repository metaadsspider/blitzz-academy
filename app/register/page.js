import { redirect } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Create account — Blitzz Academy" };

export default async function RegisterPage({ searchParams }) {
  const user = await getSessionUser().catch(() => null);
  const next = typeof searchParams?.next === "string" ? searchParams.next : "";
  if (user) redirect(next.startsWith("/") ? next : "/dashboard");
  return <RegisterForm next={next} />;
}
