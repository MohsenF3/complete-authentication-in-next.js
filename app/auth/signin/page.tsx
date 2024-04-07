import SignInForm from "@/components/SignInForm";
import Link from "next/link";

interface SignInPageProps {
  searchParams: { callbackUrl: string };
}

export default function SignInPage({ searchParams }: SignInPageProps) {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-medium text-center">Sign In</h1>

      <SignInForm callbackUrl={searchParams.callbackUrl} />

      {/* link to forgot password page */}
      <div className="text-center">
        <Link
          href="/auth/forgotPass"
          className="block hover:text-sky-500 transition-colors mb-4"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
