import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// 获取服务器端会话
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

// 检查用户是否已认证
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  return user;
}

// 检查用户角色权限
export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }
  
  return user;
}

// 检查管理员权限
export async function requireAdmin() {
  return await requireRole(["ADMIN", "SUPER_ADMIN", "MODERATOR"]);
}

// 检查超级管理员权限
export async function requireSuperAdmin() {
  return await requireRole(["SUPER_ADMIN"]);
}

// 获取用户统计信息
export async function getUserStats(userId: string) {
  // 这里可以添加获取用户统计信息的逻辑
  return {
    articles: 0,
    posts: 0,
    comments: 0,
    likes: 0,
    followers: 0,
    following: 0,
  };
}

// 更新用户信息
export async function updateUserProfile(
  userId: string,
  data: {
    displayName?: string;
    avatar?: string;
    bio?: string;
  }
) {
  // 这里可以添加更新用户信息的逻辑
  return { success: true };
}

// 检查用户名是否可用
export async function isUsernameAvailable(username: string): Promise<boolean> {
  // 这里可以添加检查用户名可用性的逻辑
  return true;
}

// 检查邮箱是否可用
export async function isEmailAvailable(email: string): Promise<boolean> {
  // 这里可以添加检查邮箱可用性的逻辑
  return true;
}

// 生成用户默认头像
export function generateDefaultAvatar(username: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
}

// 密码强度检查
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback = [];
  let score = 0;

  // 长度检查
  if (password.length >= 8) score += 1;
  else feedback.push("密码至少需要8个字符");

  // 大小写检查
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  else feedback.push("密码需要包含大小写字母");

  // 数字检查
  if (/\d/.test(password)) score += 1;
  else feedback.push("密码需要包含数字");

  // 特殊字符检查
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push("密码需要包含特殊字符");

  return { score, feedback };
}

// 用户等级计算
export function calculateUserLevel(experience: number): number {
  return Math.floor(experience / 1000) + 1;
}

// 经验值计算
export function calculateExperienceForLevel(level: number): number {
  return (level - 1) * 1000;
}

// 用户角色权限检查
export function hasPermission(userRole: string, requiredPermission: string): boolean {
  const rolePermissions: Record<string, string[]> = {
    USER: ["read", "comment", "like"],
    EDITOR: ["read", "comment", "like", "create", "edit_own"],
    MODERATOR: ["read", "comment", "like", "create", "edit_any", "delete_any", "moderate"],
    ADMIN: ["read", "comment", "like", "create", "edit_any", "delete_any", "moderate", "manage_users"],
    SUPER_ADMIN: ["read", "comment", "like", "create", "edit_any", "delete_any", "moderate", "manage_users", "manage_system"],
  };

  return rolePermissions[userRole]?.includes(requiredPermission) || false;
}

// 生成验证令牌
export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 验证令牌有效期（24小时）
export function isTokenValid(createdAt: Date): boolean {
  const now = new Date();
  const tokenAge = now.getTime() - createdAt.getTime();
  return tokenAge < 24 * 60 * 60 * 1000; // 24小时
}