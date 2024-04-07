"use client";

import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
} from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, button } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import validator from "validator";
import { z } from "zod";

interface SignInFormProps {
  callbackUrl?: string;
}

const FormSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .refine(validator.isEmail, "Please enter a valid email address"),

  password: z
    .string({ required_error: "Please enter your password" })
    .min(8, "Password should have at least 8 characters")
    .max(50, "Password must be less than 50 characters"),
});

type inputType = z.infer<typeof FormSchema>;

export default function SignInForm({ callbackUrl }: SignInFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<inputType>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisible = () => setIsVisible(!isVisible);

  const onSubmit: SubmitHandler<inputType> = async (data) => {
    const result = await signIn("credentials", {
      // set to true redirect user to callback that we specify for that and refresh the page but we redirect user manually with useRouter hook
      redirect: false,
      username: data.email,
      password: data.password,
    });

    if (!result?.ok) {
      toast.error(result?.error);
      return;
    }

    toast.success("Welcome To App");
    router.push(callbackUrl ? callbackUrl : "/");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 max-w-lg mx-auto border p-5 rounded-xl my-10 bg-slate-200"
    >
      {/* email  */}
      <Input
        type="email"
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        {...register("email")}
        label="Email"
        startContent={<EnvelopeIcon className="w-4" />}
      />

      {/* password */}
      <Input
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        {...register("password")}
        label="Password"
        type={isVisible ? "text" : "password"}
        startContent={<KeyIcon className="w-4" />}
        endContent={
          <button onClick={toggleVisible}>
            {isVisible ? (
              <EyeSlashIcon className="w-4" />
            ) : (
              <EyeIcon className="w-4" />
            )}
          </button>
        }
      />

      <div className="flex flex-col justify-end col-span-2 gap-8">
        <Button
          type="submit"
          color="success"
          isLoading={isSubmitting}
          className="self-end"
        >
          Submit
        </Button>

        {/* redirect user to sign up form */}
        <div className="text-center">
          <span>Don't have an account?</span>
          <Link
            href="/auth/signup"
            className="hover:text-sky-800 text-sky-500 transition-colors"
          >
            {" "}
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
}
