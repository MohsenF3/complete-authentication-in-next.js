"use server";

import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import prisma from "../prisma";
import {
  compileActivationTemplate,
  compileResetPasswordTemplate,
  sendMail,
} from "../mail";
import { signJwt, verifyJwt } from "../jwt";

type ActivateUserFunction = (
  jwtUserId: string
) => Promise<"userNotExist" | "alreadyActivated" | "success">;

type ResetPasswordFunction = (
  jwtUserId: string,
  password: string
) => Promise<"userNotExist" | "success">;

export const registerUser = async (
  user: Omit<User, "id" | "emailVerified" | "image">
) => {
  const result = await prisma.user.create({
    data: {
      ...user,
      password: await bcrypt.hash(user.password, 10),
    },
  });

  // encode userId for activation
  const jwtUserId = signJwt({ id: result.id });
  const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;

  // body to show in email
  const body = compileActivationTemplate(user.firstName, activationUrl);

  await sendMail({
    to: user.email,
    subject: "Activate Your Account ",
    body,
  });

  return result;
};

export const activateUser: ActivateUserFunction = async (jwtUserId) => {
  // decode the jwtUserId and extract userId
  const payload = verifyJwt(jwtUserId);
  const userId = payload?.id;

  // find user in database
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  // user not exist
  if (!user) return "userNotExist";

  // user already activated
  if (user.emailVerified) return "alreadyActivated";

  // update user
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  return "success";
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) throw new Error("The User is not exist!");

  // send email with reset password link
  const jwtUserId = signJwt({ id: user.id });
  const resetPasswordLink = `${process.env.NEXTAUTH_URL}/auth/resetPassword/${jwtUserId}`;

  const body = compileResetPasswordTemplate(user.firstName, resetPasswordLink);

  const result = await sendMail({
    to: user.email,
    subject: "Reset Password",
    body,
  });
};

export const resetPassword: ResetPasswordFunction = async (
  jwtUserId,
  password
) => {
  // verify jwtUserId
  const payload = verifyJwt(jwtUserId);
  if (!payload) return "userNotExist";
  const userId = payload.id;

  // find user in database
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return "userNotExist";

  // update user password
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  if (result) return "success";
  else throw new Error("Something went wrong!");
};
