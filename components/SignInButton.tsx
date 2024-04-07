"use client";

import { Button } from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function SignInButton() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-3">
      {session && session.user ? (
        <>
          <p>{`${session.user.firstName} ${session.user.lastName}`}</p>
          <Button
            as={Link}
            href="/api/auth/signout"
            color="danger"
            variant="ghost"
          >
            Log Out
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" onClick={() => signIn()}>
            Sign in
          </Button>
          <Button as={Link} color="primary" href="/auth/signup" variant="solid">
            Sign Up
          </Button>
        </>
      )}
    </div>
  );
}
