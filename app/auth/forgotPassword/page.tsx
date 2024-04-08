"use client";

import { forgotPassword } from "@/lib/actions/authActions";
import { EnvelopeIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import validator from "validator";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .refine(validator.isEmail, "Please enter a valid email address"),
});

type inputForm = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<inputForm>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<inputForm> = async (data) => {
    try {
      await forgotPassword(data.email);
      toast.success("Reset password link was sent to your email!");
      reset();
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border p-5 rounded-xl my-5 bg-slate-200 grid gap-5 max-w-lg mx-auto"
    >
      <p className="text-xl font-medium">Enter Your Email Address :</p>
      <Input
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        {...register("email")}
        className="col-span-2"
        type="email"
        label="Email"
        startContent={<EnvelopeIcon className="w-4" />}
      />

      <div className="flex justify-end col-span-2">
        <Button type="submit" color="success" isLoading={isSubmitting}>
          Submit
        </Button>
      </div>
    </form>
  );
}
