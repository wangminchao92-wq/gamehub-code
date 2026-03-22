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
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);

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
      },
      "accessibilityAPI": "ARIA",
      "accessibilityControl": ["fullKeyboardControl", "fullMouseControl"],
      "accessibilityFeature": ["alternativeText", "longDescription", "highContrastDisplay"],
      "audience": {
        "@type": "Audience",
        "audienceType": "administrators"
      }
    }
  ];

  // 加载用户数据
  useEffect(() => {
    loadUsers();
  }, [currentPage, filterRole, filterStatus, searchQuery]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));

      // 模拟数据
      const mockUsers: UserData[] = Array.from({ length: 50 }, (_, i) => ({
        id: `user-${i + 1}`,
        username: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        displayName: i % 3 === 0 ? `玩家${i + 1}` : null,
        avatar: i % 5 === 0 ? `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 1}` : null,
        role: i === 0 ? 'SUPER_ADMIN' : i < 5 ? 'ADMIN' : i < 15 ? 'MODERATOR' : i < 30 ? 'EDITOR' : 'USER',
        level: Math.floor(Math.random() * 50) + 1,
        experience: Math.floor(Math.random() * 10000),
        points: Math.floor(Math.random() * 5000),
        status: i % 10 === 0 ? 'BANNED' : i % 20 === 0 ? 'SUSPENDED' : 'ACTIVE',
        emailVerified: i % 3 !== 0,
        lastLoginAt: i % 4 === 0 ? new Date(Date.now() - Math.random() * 10000000000).toISOString() : null,
        createdAt: new Date(Date.now() - Math.random() * 100000000000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      }));

      // 应用过滤
      let filteredUsers = mockUsers;
      
      if (filterRole !== 'ALL') {
        filteredUsers = filteredUsers.filter(user => user.role === filterRole);
      }
      
      if (filterStatus !== 'ALL') {
        filteredUsers = filteredUsers.filter(user => user.status === filterStatus);
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.displayName && user.displayName.toLowerCase().includes(query))
        );
      }

      // 分页
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      setUsers(paginatedUsers);
      setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
    } catch (err: any) {
      setError(err.message || '加载用户数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理用户选择
  const handleUserSelect = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  // 处理全选
  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(user => user.id)));
    }
  };

  // 处理编辑用户
  const handleEditUser = (userId: string) => {
    router.push(`/admin/users/edit/${userId}`);
  };

  // 处理删除用户
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('确定要删除此用户吗？此操作不可撤销。')) {
      return;
    }

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      setSelectedUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      
      alert('用户删除成功');
    } catch (err: any) {
      alert('删除失败: ' + err.message);
    }
  };

  // 处理批量操作
  const handleBatchAction = async (action: string) => {
    if (selectedUsers.size === 0) {
      alert('请先选择用户');
      return;
    }

    if (action === 'delete') {
      if (!confirm(`确定要删除选中的 ${selectedUsers.size} 个用户吗？此操作不可撤销。`)) {
        return;
      }
    }

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'delete') {
        setUsers(prev => prev.filter(user => !selectedUsers.has(user.id)));
        setSelectedUsers(new Set());
        alert(`成功删除 ${selectedUsers.size} 个用户`);
      }
    } catch (err: any) {
      alert('操作失败: ' + err.message);
    }
  };

  // 获取角色徽章
  const getRoleBadge = (role: string) => {
    const roleConfig = {
      SUPER_ADMIN: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: '超级管理员' },
      ADMIN: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', label: '管理员' },
      MODERATOR: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: '版主' },
      EDITOR: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: '编辑' },
      USER: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200', label: '用户' },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.USER;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: '活跃', icon: <CheckCircle className="w-3 h-3" /> },
      BANNED: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: '封禁', icon: <XCircle className="w-3 h-3" /> },
      SUSPENDED: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: '暂停', icon: <AlertCircle className="w-3 h-3" /> },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
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
        noindex={true}
        nofollow={true}
        robots="noindex, nofollow"
        author="GameHub Admin"
      />

      <div className="container mx-auto px-4 py-8">
        {/* 页面标题和操作 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">用户管理</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                管理GameHub用户账户、权限和状态
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/admin/users/create')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                添加用户
              </button>
              
              <button
                onClick={loadUsers}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* 错误显示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* 搜索和过滤 */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 搜索框 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                搜索用户
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="用户名、邮箱或显示名..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 角色过滤 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                角色过滤
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">所有角色</option>
                <option value="SUPER_ADMIN">超级管理员</option>
                <option value="ADMIN">管理员</option>
                <option value="MODERATOR">版主</option>
                <option value="EDITOR">编辑</option>
                <option value="USER">用户</option>
              </select>
            </div>

            {/* 状态过滤 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                状态过滤
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">所有状态</option>
                <option value="ACTIVE">活跃</option>
                <option value="BANNED">封禁</option>
                <option value="SUSPENDED">暂停</option>
              </select>
            </div>
          </div>

          {/* 批量操作 */}
          {selectedUsers.size > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  已选择 {selectedUsers.size} 个用户
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBatchAction('delete')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                  >
                    删除选中
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 用户表格 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">加载用户数据中...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">未找到用户</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  清除搜索条件
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedUsers.size === users.length && users.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        用户
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        角色
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        状态
                      </