import SignUpForm from "@/components/SignUpForm";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-medium text-center">Sign Up</h1>

      <SignUpForm />

      <div className="text-center">
        <span>Already Signed Up?</span>
        <Link href="/auth/signin" className="hover:text-blue-800">
          {" "}
          Sign In
        </Link>
      </div>
    </div>
  );
}
