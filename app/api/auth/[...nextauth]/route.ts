import prisma from "@/lib/prisma";
import { AuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";

export const authOptions: AuthOptions = {
  // authentication options
  providers: [
    CredentialsProvider({
      credentials: {
        username: {
          label: "User Name",
          type: "text",
          placeholder: "Your User Name",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      // check username(email) and password to authenticate
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.username,
          },
        });

        // user not found throw error
        if (!user) throw new Error("User name or password is not correct");

        if (!credentials?.password)
          throw new Error("Please provide your password");

        // verify the password using bcrypt
        const isPasswordCorrect = bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) throw new Error("Your password is incorrect");

        // return user object without password field
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
