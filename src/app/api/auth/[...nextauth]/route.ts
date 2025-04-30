import prisma from "@/prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession, NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Reference: https://authjs.dev/getting-started/typescript#:~:text=use%20generics%3F-,Module%20Augmentation,-Auth.js%20libraries
declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
      role: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }

  // Add role to the User type
  interface User {
    role?: string;
  }
}

const config: NextAuthConfig = {
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
        console.log("🔐 Credentials authorize starting...");
        if (!credentials?.email || !credentials.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        console.log(`🔍 Looking up user with email: ${credentials.email}`);
        const user = await prisma.user.findUnique({
          where: {
            email: String(credentials.email),
          },
        });

        if (!user) {
          console.log("❌ User not found");
          return null;
        }

        console.log(`✅ User found: ${user.name}, Role: ${user.role}`);
        
        const passwordValid = await bcrypt.compare(
          String(credentials.password), 
          user.password ?? ""
        );
        
        if (!passwordValid) {
          console.log("❌ Password invalid");
          return null;
        }
        
        console.log("✅ Password valid");

        // Check visibility settings for students and faculty
        if (user.role === "student" || user.role === "faculty") {
          const visibilityName = user.role === "student" ? "studentLogin" : "facultyLogin";
          console.log(`🔒 Checking ${visibilityName} visibility for ${user.role}`);
          
          try {
            // Use raw query to check visibility state
            console.log(`🔍 Executing query for ${visibilityName}`);
            const visibilityResult = await prisma.$queryRaw`
              SELECT State FROM Visibility_State WHERE Visibility_Name = ${visibilityName}
            `;
            
            console.log(`📊 Visibility result:`, visibilityResult);
            
            const visibility = Array.isArray(visibilityResult) && visibilityResult.length > 0 
              ? visibilityResult[0] 
              : null;
            
            // If visibility state is 0 or not found, deny login
            if (!visibility) {
              console.log(`❌ No visibility setting found for ${visibilityName}`);
              return null;
            }
            
            if (visibility.State === 0) {
              console.log(`🚫 ${user.role} login denied: ${visibilityName} is disabled (State=0)`);
              return null;
            }
            
            console.log(`✅ ${visibilityName} is enabled (State=1)`);
          } catch (error) {
            console.error(`❌ Error checking ${user.role} login visibility:`, error);
            return null;
          }
        }

        console.log(`🔓 Authorizing ${user.role}: ${user.name}`);
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
    async signIn({ user, account }) {
      console.log(`🔑 SignIn callback for ${account?.provider} provider`);
      console.log(`👤 User attempting login:`, { 
        name: user.name,
        email: user.email,
        role: user.role 
      });
      
      // Get user role
      const role = user.role;
      console.log(`👑 User role: ${role}`);
      
      // If user is a student, check studentLogin visibility
      if (role === "student") {
        console.log("🎓 Student login attempt - checking visibility");
        try {
          // Use raw query to check visibility state
          console.log("🔍 Executing query for studentLogin visibility");
          const visibilityResult = await prisma.$queryRaw`
            SELECT State FROM Visibility_State WHERE Visibility_Name = 'studentLogin'
          `;
          
          console.log("📊 Student visibility result:", visibilityResult);
          
          const visibility = Array.isArray(visibilityResult) && visibilityResult.length > 0 
            ? visibilityResult[0] 
            : null;
          
          // If visibility state is 0 or not found, deny login
          if (!visibility) {
            console.log("❌ No visibility setting found for studentLogin");
            return false;
          }
          
          if (visibility.State === 0) {
            console.log("🚫 Student login denied: studentLogin is disabled (State=0)");
            return false;
          }
          
          console.log("✅ Student login is enabled (State=1)");
        } catch (error) {
          console.error("❌ Error checking student login visibility:", error);
          return false;
        }
      }
      
      // If user is a faculty, check facultyLogin visibility
      if (role === "faculty") {
        console.log("👨‍🏫 Faculty login attempt - checking visibility");
        try {
          // Use raw query to check visibility state
          console.log("🔍 Executing query for facultyLogin visibility");
          const visibilityResult = await prisma.$queryRaw`
            SELECT State FROM Visibility_State WHERE Visibility_Name = 'facultyLogin'
          `;
          
          console.log("📊 Faculty visibility result:", visibilityResult);
          
          const visibility = Array.isArray(visibilityResult) && visibilityResult.length > 0 
            ? visibilityResult[0] 
            : null;
          
          // If visibility state is 0 or not found, deny login
          if (!visibility) {
            console.log("❌ No visibility setting found for facultyLogin");
            return false;
          }
          
          if (visibility.State === 0) {
            console.log("🚫 Faculty login denied: facultyLogin is disabled (State=0)");
            return false;
          }
          
          console.log("✅ Faculty login is enabled (State=1)");
        } catch (error) {
          console.error("❌ Error checking faculty login visibility:", error);
          return false;
        }
      }
      
      // For all other roles (admin, coordinator, guest), allow login
      console.log(`✅ Login allowed for ${role}`);
      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          role: u.role,
        };
      }
      return token;
    },
    session(params) {
      return {
        ...params.session,
        user: {
          ...params.session.user,
          id: params.token.id as string,
          role: params.token.role as string,
        },
      };
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
