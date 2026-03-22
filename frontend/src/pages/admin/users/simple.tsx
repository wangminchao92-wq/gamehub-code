import React, { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import { Search, User, Mail, Shield, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  role: string;
  status: string;
  level: number;
  points: number;
}

export default function SimpleUserManagementPage() {
  // 管理页面结构化数据 (noindex保护管理后台)
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "用户管理 - GameHub管理后台",
      "description": "GameHub管理后台的用户管理界面",
      "maintainer": {
        "@type": "Organization",
        "name": "GameHub"
      }
    }
  ];
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      // 测试环境使用管理员ID
      const userId = 'd191fcda-81e1-4a07-bbf2-bd0d469844e2';
      
      const response = await fetch(
        `/api/admin/users/simple?limit=20&search=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            'x-user-id': userId,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data.users);
      } else {
        setError(data.error || '获取用户列表失败');
        console.error('API错误:', data);
      }
    } catch (err) {
      setError(`网络错误: ${err.message}`);
      console.error('获取用户错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchUsers();
  }, []);

  // 搜索处理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  // 获取角色显示
  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      'SUPER_ADMIN': '超级管理员',
      'ADMIN': '管理员',
      'MODERATOR': '审核员',
      'EDITOR': '编辑',
      'USER': '用户',
    };
    return roleMap[role] || role;
  };

  // 获取角色颜色
  const getRoleColor = (role: string) => {
    const colorMap: Record<string, string> = {
      'SUPER_ADMIN': 'bg-purple-100 text-purple-800',
      'ADMIN': 'bg-red-100 text-red-800',
      'MODERATOR': 'bg-blue-100 text-blue-800',
      'EDITOR': 'bg-green-100 text-green-800',
      'USER': 'bg-gray-100 text-gray-800',
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <MainLayout>
      <SEO
        title="用户管理 - GameHub管理后台"
        description="GameHub管理后台的用户管理界面，管理用户账户、权限和状态。"
        keywords="用户管理,权限管理,账户管理,管理员后台,用户审核"
        canonical="https://gamehub.com/admin/users"
        ogImage="https://gamehub.com/og-admin.jpg"
        ogType="website"
        structuredData={structuredData}
        noindex={true}  // 管理后台通常noindex
        nofollow={true}
        robots="noindex, nofollow"
        author="GameHub Admin"
        section="Administration"
        tags={["admin", "user management", "administration", "backend"]}
      />
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">用户管理</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            查看和管理 GameHub 用户账户
          </p>
        </div>

        {/* 操作栏 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索用户名、邮箱..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* 刷新按钮 */}
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center text-red-700 dark:text-red-300">
              <div className="mr-2">❌</div>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* 用户列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            // 加载状态
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">加载用户数据中...</p>
            </div>
          ) : users.length === 0 ? (
            // 空状态
            <div className="p-12 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                暂无用户数据
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? '没有找到匹配的用户' : '用户列表为空'}
              </p>
            </div>
          ) : (
            // 用户表格
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      用户信息
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      角色
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      状态
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      等级/积分
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.displayName || user.username}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              ID: {user.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleDisplay(user.role)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user.status === 'ACTIVE' ? (
                          <span className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            活跃
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600">
                            <XCircle className="w-4 h-4 mr-1" />
                            禁用
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div className="font-medium">Lv.{user.level}</div>
                          <div className="text-gray-500">{user.points} 积分</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 统计信息 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {users.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">总用户数</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'ACTIVE').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">活跃用户</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">管理员</div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
            使用说明
          </h3>
          <ul className="text-blue-700 dark:text-blue-400 space-y-1">
            <li>• 在搜索框中输入用户名或邮箱可以快速查找用户</li>
            <li>• 点击"刷新"按钮可以更新用户列表</li>
            <li>• 当前显示 {users.length} 个用户信息</li>
            <li>• 管理员可以查看所有用户的基本信息和状态</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}