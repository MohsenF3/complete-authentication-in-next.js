import { activateUser } from "@/lib/actions/authActions";

interface ActivationPageProps {
  params: { jwt: string };
}

export default async function ActivationPage({ params }: ActivationPageProps) {
  const result = await activateUser(params.jwt);

  return (
    <div className="w-full h-[calc(100vh-7rem)] flex items-center justify-center">
      {result === "userNotExist" ? (
        <p className="text-red-500 text-3xl">User not exist!</p>
      ) : result === "alreadyActivated" ? (
        <p className="text-yellow-400 text-3xl">User already activated!</p>
      ) : result === "success" ? (
        <p className="text-success-400 text-3xl">
          Success! The User now is active
        </p>
      ) : (
        <p className="text-red-500 text-3xl">Something Went Wrong!</p>
      )}
    </div>
  );
}
