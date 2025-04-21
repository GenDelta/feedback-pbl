import prisma from "@/prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        let role = "guest";
        if (profile.email.endsWith("@gmail.com")) {
          role = "guest";
        }
        if (profile.email.endsWith("@sitpune.edu.in")) {
          if (profile.email.includes("btech")) {
            role = "student";
          } else if (profile.email.includes("coordinator")) {
            role = "coordinator";
          } else if (profile.email.includes("systemadmin")) {
            role = "admin";
          } else {
            role = "faculty";
          }
        }
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          role,
          image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      name: "Email",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: String(credentials.email),
          },
        });

        if (
          !user ||
          !(await bcrypt.compare(String(credentials.password), user.password!))
        ) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    // session(params) {
    //   return {
    //     ...params.session,
    //     user: {
    //       ...params.session.user,
    //       role: params.user.role,
    //     },
    //   };
    // },
  },
});

export { handlers as GET, handlers as POST, auth, signIn, signOut };
