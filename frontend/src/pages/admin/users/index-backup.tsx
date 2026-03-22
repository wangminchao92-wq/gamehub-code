import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import {
  Search,
  Filter,
  User,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  avatar: string | null;
  role: string;
  level: number;
  experience: number;
  points: number;
  status: string;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function UserManagementPage() {
  // 管理页面结构化数据 (noindex保护管理后台)
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "用户管理 - GameHub管理后台",
      "description": "GameHub管理后台的用户管理界面，管理用户账户、权限和状态。",
      "maintainer": {
        "@type": "Organization",
        "name": "GameHub"
      }
    }
  ];
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // 获取用户列表
  const fetchUsers = async (page = 1, search = '') => {
    setLoading(true);
    setError('');
    
    try {
      // 这里应该使用真实的用户ID，测试环境使用管理员ID
      const userId = 'd191fcda-81e1-4a07-bbf2-bd0d469844e2'; // 管理员ID
      
      const response = await fetch(
        `/api/admin/users/simple?page=${page}&limit=10&search=${encodeURIComponent(search)}`,
        {
          headers: {
            'x-user-id': userId
          }
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data.users);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        setError(data.error || '获取用户列表失败');
      }
    } catch (err) {
      setError('网络错误，请检查连接');
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
    setCurrentPage(1);
    fetchUsers(1, searchTerm);
  };

  // 分页处理
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchUsers(page, searchTerm);
  };

  // 用户选择处理
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // 选择所有用户
  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  // 获取角色徽章
  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { color: string; label: string }> = {
      'SUPER_ADMIN': { color: 'bg-purple-100 text-purple-800', label: '超级管理员' },
      'ADMIN': { color: 'bg-red-100 text-red-800', label: '管理员' },
      'MODERATOR': { color: 'bg-blue-100 text-blue-800', label: '审核员' },
      'EDITOR': { color: 'bg-green-100 text-green-800', label: '编辑' },
      'USER': { color: 'bg-gray-100 text-gray-800', label: '用户' },
    };
    
    const config = roleConfig[role] || roleConfig.USER;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    if (status === 'ACTIVE') {
      return (
        <span className="flex items-center text-green-600">
          <CheckCircle className="w-4 h-4 mr-1" />
          活跃
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-red-600">
          <XCircle className="w-4 h-4 mr-1" />
          禁用
        </span>
      );
    }
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
            管理 GameHub 用户账户、权限和状态
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
                  placeholder="搜索用户名、邮箱或昵称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* 操作按钮 */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchUsers(currentPage, searchTerm)}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                刷新
              </button>
              
              <button
                onClick={() => router.push('/admin/users/create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加用户
              </button>
            </div>
          </div>

          {/* 批量操作栏 */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-blue-700 dark:text-blue-300">
                  已选择 {selectedUsers.length} 个用户
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200">
                  激活
                </button>
                <button className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200">
                  禁用
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
                  删除
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* 用户表格 */}
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
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm ? '没有找到匹配的用户' : '还没有用户数据，请添加用户'}
              </p>
              <button
                onClick={() => router.push('/admin/users/create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                添加第一个用户
              </button>
            </div>
          ) : (
            // 用户表格
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 px-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === users.length && users.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        用户
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
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        最后登录
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.username}
                                  className="w-10 h-10 rounded-full"
                                />
                              ) : (
                                <User className="w-5 h-5 text-gray-500" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {user.displayName || user.username}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div className="font-medium">Lv.{user.level}</div>
                            <div className="text-gray-500">{user.points} 积分</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.lastLoginAt 
                              ? new Date(user.lastLoginAt).toLocaleDateString('zh-CN')
                              : '从未登录'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => router.push(`/admin/users/${user.id}`)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="编辑"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 text-red-600 hover:text-red-800"
                              title="删除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:text-gray-800">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      第 {currentPage} 页，共 {totalPages} 页
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 rounded-lg ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 统计信息 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="