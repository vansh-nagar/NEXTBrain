import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: " email",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "vanshngar@1029",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        const username = credentials?.username;
        const password = credentials?.password;

        console.log(username, password);
        const user = {
          name: "vansh",
        };

        if (!user) {
          return user;
        } else {
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
});

export const GET = handler;
export const POST = handler;
