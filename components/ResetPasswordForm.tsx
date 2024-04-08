"use client";

import { EyeIcon, EyeSlashIcon, KeyIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { passwordStrength } from "check-password-strength";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import PasswordStrength from "./PasswordStrength";
import { toast } from "react-toastify";
import { resetPassword } from "@/lib/actions/authActions";

interface ResetPasswordFormProps {
  jwtUserId: string;
}

const FormSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password should have at least 8 characters")
      .max(50, "Password must be less than 50 characters"),

    confirmPassword: z
      .string()
      .min(8, "Password should have at least 8 characters")
      .max(50, "Password must be less than 50 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password fields do not match.",
    path: ["confirmPassword"],
  });

type inputForm = z.infer<typeof FormSchema>;

export default function ResetPasswordForm({
  jwtUserId,
}: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<inputForm>({
    resolver: zodResolver(FormSchema),
  });

  const [passStrength, setPassStrength] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // check the password strength
  useEffect(() => {
    setPassStrength(passwordStrength(watch().password).id);
  }, [watch().password]);

  const toggleVisible = () => setIsVisible(!isVisible);

  const onSubmit: SubmitHandler<inputForm> = async (data) => {
    try {
      const result = await resetPassword(jwtUserId, data.password);
      if (result === "success")
        toast.success("Your password has been reset successfully!");

      // if user not exist or jwtUserId is not verified
      if (result === "userNotExist") toast.success("The user does not exist!");
    } catch (error) {
      toast.error("Something Went Wrong!");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 border p-5 rounded-xl my-5 bg-slate-200"
    >
      <p className="text-center text-xl">Reset Your Password</p>
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

      {/* show password strength */}
      <PasswordStrength passStrength={passStrength} />

      {/* confirmPassword*/}
      <Input
        isInvalid={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword?.message}
        {...register("confirmPassword")}
        label="Confirm Password"
        type={isVisible ? "text" : "password"}
        startContent={<KeyIcon className="w-4" />}
      />

      <div className="flex justify-end col-span-2">
        <Button type="submit" color="success" isLoading={isSubmitting}>
          Submit
        </Button>
      </div>
    </form>
  );
}
