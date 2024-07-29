import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
        token: string,
        first_name: string;
        last_name: string;
        user: string;
        role: string;
        img: string; 
    };
  }
}