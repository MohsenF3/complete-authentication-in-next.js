"use client";

import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import validator from "validator";
import { z } from "zod";
import PasswordStrength from "./PasswordStrength";
import { passwordStrength } from "check-password-strength";
import { registerUser } from "@/lib/actions/authActions";
import { toast } from "react-toastify";

const FormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "firstName must be more than one character")
      .max(48, "firstName must less than 48 characters")
      .regex(new RegExp("^[a-zA-z]+$"), "no special characters allowed"),

    lastName: z
      .string()
      .min(2, "lastName must be more than one character")
      .max(48, "lastName must less than 48 characters")
      .regex(new RegExp("^[a-zA-z]+$"), "no special characters allowed"),

    email: z
      .string()
      .email("Please enter a valid email address")
      .refine(validator.isEmail, "Please enter a valid email address"),

    phone: z
      .string()
      .refine(validator.isMobilePhone, "Please provide a valid mobile number"),

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

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
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

  // handle form submission
  const onSubmit: SubmitHandler<inputForm> = async (data) => {
    const { confirmPassword, ...dataWithoutConfirmPassword } = data;

    try {
      const result = await registerUser(dataWithoutConfirmPassword);
      toast.success("The User Registered Successfully");
    } catch (error) {
      toast.error("Something Went Wrong!");
      console.error(error);
    }
  };

  return (
    <form
      action=""
      className="grid md:grid-cols-2 grid-cols-1 gap-5 border p-5 rounded-xl my-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* fist name */}
      <Input
        isInvalid={!!errors.firstName}
        errorMessage={errors.firstName?.message}
        {...register("firstName")}
        label="First Name"
        startContent={<UserIcon className="w-4" />}
      />

      {/* last name */}
      <Input
        isInvalid={!!errors.lastName}
        errorMessage={errors.lastName?.message}
        {...register("lastName")}
        label="Last Name"
        startContent={<UserIcon className="w-4" />}
      />

      {/* email */}
      <Input
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        {...register("email")}
        className="col-span-2"
        type="email"
        label="Email"
        startContent={<EnvelopeIcon className="w-4" />}
      />

      {/* phone */}
      <Input
        isInvalid={!!errors.phone}
        errorMessage={errors.phone?.message}
        {...register("phone")}
        className="col-span-2"
        label="Phone"
        startContent={<PhoneIcon className="w-4" />}
      />

      {/* password */}
      <Input
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        {...register("password")}
        className="col-span-2"
        label="Password"
        type={isVisible ? "text" : "password"}
        startContent={<KeyIcon className="w-4" />}
        endContent={
          isVisible ? (
            <EyeSlashIcon className="w-4" onClick={toggleVisible} />
          ) : (
            <EyeIcon className="w-4" onClick={toggleVisible} />
          )
        }
      />

      {/* show password strength */}
      <PasswordStrength passStrength={passStrength} />

      {/* confirmPassword*/}
      <Input
        isInvalid={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword?.message}
        {...register("confirmPassword")}
        className="col-span-2"
        label="Confirm Password"
        type={isVisible ? "text" : "password"}
        startContent={<KeyIcon className="w-4" />}
      />

      <div className="flex justify-end col-span-2">
        <Button type="submit" color="success">
          Submit
        </Button>
      </div>
    </form>
  );
}
