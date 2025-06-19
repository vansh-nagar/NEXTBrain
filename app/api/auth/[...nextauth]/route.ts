import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import GitHubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "email",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "XYZ@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          return;
        }

        const { username, password } = credentials;

        const foundUser = await prisma.user.findUnique({
          where: {
            email: username,
          },
        });

        if (foundUser) {
          if (!foundUser.password) {
            return null;
          }
          const result = await bcrypt.compare(password, foundUser.password);
          if (result) {
            console.log("foundUser:", foundUser);
            const user = { name: foundUser.email };
            return user;
          } else {
            return null;
          }
        }

        // const hash = await bcrypt.hash(password, 10);
        // const createdUser = await prisma.user.create({
        //   data: {
        //     email: credentials.username,
        //     password: hash,
        //     sharable: false,
        //   },
        // });
        // console.log("createdUser:", createdUser);
        // const user = { name: createdUser.email };
        // return user;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});

export const GET = handler;
export const POST = handler;
