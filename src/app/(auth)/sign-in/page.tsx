import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignInForm from "@/features/auth/sign-in-form";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory-50 px-4">
      <SignInForm />
    </main>
  );
}
