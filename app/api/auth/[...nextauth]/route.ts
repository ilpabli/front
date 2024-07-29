import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import  { AxiosError } from "axios";
import { axiosLogin } from "@/utils/axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        user: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.user || !credentials?.password) {
          throw new Error("Username and password are required");
        }
        try {
          const res = await axiosLogin.post("users/auth", credentials);
          const userRes = res.data;
          if (userRes && userRes.status === "success") {
            return {
              id: userRes.id,
              user: userRes?.user.user,
              first_name: userRes?.user.first_name,
              last_name: userRes?.user.last_name,
              img: userRes?.user.img,
              role: userRes?.user.role,
              token: userRes.token,
            };
          } else {
            throw new Error("Invalid username or password");
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.error || "Fallo la Autenticación";
            throw new Error(errorMessage);
          }
          throw error;
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };