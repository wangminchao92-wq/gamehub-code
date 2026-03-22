import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

// 扩展NextAuth类型
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      displayName?: string;
      avatar?: string;
      role: string;
      level: number;
      points: number;
      experience: number;
    };
  }

  interface User {
    id: string;
    email: string;
    username: string;
    displayName?: string;
    avatar?: string;
    role: string;
    level: number;
    points: number;
    experience: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    displayName?: string;
    avatar?: string;
    role: string;
    level: number;
    points: number;
    experience: number;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  pages: {
    signIn: "/login",
    signUp: "/register-nextauth", // 使用新的注册页面
    error: "/login",
    verifyRequest: "/verify-request",
    newUser: "/welcome", // 新用户欢迎页面
  },
  providers: [
    // 邮箱/密码认证
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "用户名或邮箱", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("请输入用户名/邮箱和密码");
        }

        try {
          // 查找用户（支持用户名或邮箱登录）
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { username: credentials.identifier },
                { email: credentials.identifier },
              ],
            },
          });

          if (!user) {
            throw new Error("用户不存在");
          }

          // 检查密码
          if (!user.passwordHash) {
            throw new Error("该账户未设置密码，请使用其他方式登录");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!isValid) {
            throw new Error("密码错误");
          }

          // 检查用户状态
          if (user.status !== "ACTIVE") {
            throw new Error("账户已被禁用，请联系管理员");
          }

          // 更新最后登录时间
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
            role: user.role,
            level: user.level,
            points: user.points,
            experience: user.experience,
          };
        } catch (error) {
          console.error("认证错误:", error);
          throw error;
        }
      },
    }),

    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      profile(profile) {
        return {
          id: profile.id.toString(),
          email: profile.email,
          username: profile.login,
          displayName: profile.name || profile.login,
          avatar: profile.avatar_url,
          role: "USER",
          level: 1,
          points: 100,
          experience: 0,
        };
      },
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          username: profile.email.split("@")[0],
          displayName: profile.name,
          avatar: profile.picture,
          role: "USER",
          level: 1,
          points: 100,
          experience: 0,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 初始登录
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.displayName = user.displayName;
        token.avatar = user.avatar;
        token.role = user.role;
        token.level = user.level;
        token.points = user.points;
        token.experience = user.experience;
      }

      // 更新会话时刷新用户数据
      if (trigger === "update" && session?.user) {
        token = { ...token, ...session.user };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email || "",
          username: token.username,
          displayName: token.displayName,
          avatar: token.avatar,
          role: token.role,
          level: token.level,
          points: token.points,
          experience: token.experience,
        };
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // 允许所有用户登录
      return true;
    },
    async redirect({ url, baseUrl }) {
      // 重定向到原始请求页面或首页
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async createUser({ user }) {
      // 新用户创建时的处理
      console.log("新用户创建:", user.email);
    },
    async linkAccount({ user, account, profile }) {
      // 账户链接时的处理
      console.log("账户链接:", user.email, account.provider);
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};