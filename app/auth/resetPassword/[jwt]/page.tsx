import ResetPasswordForm from "@/components/ResetPasswordForm";
import { verifyJwt } from "@/lib/jwt";

interface ResetPasswordPageProps {
  params: { jwt: string };
}

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  // verify jwtUserId
  const payload = verifyJwt(params.jwt);
  if (!payload) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)] text-red-500 text-2xl">
        The URL is not valid!
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <ResetPasswordForm jwtUserId={params.jwt} />
    </div>
  );
}
