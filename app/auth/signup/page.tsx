import SignUpForm from "@/components/SignUpForm";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-medium text-center">Sign Up</h1>

      <SignUpForm />

      <div className="text-center">
        <span>Already Signed In?</span>
        <Link
          href="/auth/signin"
          className="hover:text-sky-800 text-sky-300 transition-colors"
        >
          {" "}
          Sign In
        </Link>
      </div>
    </div>
  );
}
