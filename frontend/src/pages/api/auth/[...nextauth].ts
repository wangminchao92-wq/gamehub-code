import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// 导出NextAuth handler
export default NextAuth(authOptions);