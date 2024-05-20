import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { connectDB } from "@/utils/database";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "username",
          placeholder: "아이디를 입력해주세요.",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "비밀번호를 입력하세요.",
        },
      },
      async authorize(credentials: any) {
        let db = (await connectDB).db("auth");
        let user = await db
          .collection("users")
          .findOne({ username: credentials?.username });
        if (user) {
          const pwcheck = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (pwcheck) {
            return user as any;
          }
          return null;
        } else {
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30d
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user = token;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(connectDB),
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
