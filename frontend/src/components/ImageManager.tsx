'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  Upload, Image as ImageIcon, X, Trash2, Edit2, Copy,
  Search, Filter, Grid, List, Eye, Download, Share2,
  CheckCircle, AlertCircle, Loader2, Plus, Star,
  Maximize2, RotateCw, Crop, Palette, Lock, Globe
} from 'lucide-react';

interface ImageFile {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  size: number;
  width: number;
  height: number;
  format: string;
  uploadedAt: Date;
  uploadedBy: string;
  tags: string[];
  description?: string;
  isPublic: boolean;
  views: number;
  downloads: number;
  altText?: string;
  caption?: string;
}

interface ImageManagerProps {
  onSelect?: (image: ImageFile) => void;
  onUpload?: (files: File[]) => Promise<ImageFile[]>;
  onDelete?: (imageIds: string[]) => Promise<void>;
  onUpdate?: (imageId: string, updates: Partial<ImageFile>) => Promise<void>;
  initialImages?: ImageFile[];
  multiple?: boolean;
  maxUploadSize?: number; // 最大上传大小（字节）
  allowedFormats?: string[]; // 允许的格式
  maxImages?: number; // 最大图片数量
  showUpload?: boolean; // 是否显示上传
  showDelete?: boolean; // 是否显示删除
  showEdit?: boolean; // 是否显示编辑
  showStats?: boolean; // 是否显示统计
  requireAuth?: boolean; // 是否需要认证
  requiredRole?: string; // 需要的角色
}

const ImageManager: React.FC<ImageManagerProps> = ({
  onSelect,
  onUpload,
  onDelete,
  onUpdate,
  initialImages = [],
  multiple = false,
  maxUploadSize = 10 * 1024 * 1024, // 10MB
  allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  maxImages = 100,
  showUpload = true,
  showDelete = true,
  showEdit = true,
  showStats = true,
  requireAuth = true,
  requiredRole = 'EDITOR',
}) => {
  const { data: session, status } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageFile[]>(initialImages);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size' | 'views'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [editingImage, setEditingImage] = useState<ImageFile | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    tags: [] as string[],
    altText: '',
    caption: '',
    isPublic: true,
  });
  const [previewImage, setPreviewImage] = useState<ImageFile | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // 检查权限
  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      setError('需要登录才能管理图片');
    }
    
    if (requireAuth && status === 'authenticated' && requiredRole) {
      const userRole = session?.user?.role;
      const roleHierarchy = ['USER', 'EDITOR', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'];
      const userLevel = roleHierarchy.indexOf(userRole || 'USER');
      const requiredLevel = roleHierarchy.indexOf(requiredRole);
      
      if (userLevel < requiredLevel) {
        setError(`需要${requiredRole}权限才能管理图片`);
      }
    }
  }, [session, status, requireAuth, requiredRole]);

  // 获取所有标签
  const allTags = Array.from(
    new Set(images.flatMap(img => img.tags))
  ).sort();

  // 过滤和排序图片
  const filteredImages = images
    .filter(image => {
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          image.name.toLowerCase().includes(query) ||
          image.description?.toLowerCase().includes(query) ||
          image.tags.some(tag => tag.toLowerCase().includes(query)) ||
          image.uploadedBy.toLowerCase().includes(query)
        );
      }
      
      // 标签过滤
      if (filterTag) {
        return image.tags.includes(filterTag);
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.uploadedAt).getTime();
          bValue = new Date(b.uploadedAt).getTime();
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'views':
          aValue = a.views;
          bValue = b.views;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // 验证文件
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    files.forEach(file => {
      // 检查格式
      if (!allowedFormats.includes(file.type)) {
        errors.push(`${file.name}: 不支持的文件格式 ${file.type}`);
        return;
      }
      
      // 检查大小
      if (file.size > maxUploadSize) {
        errors.push(`${file.name}: 文件太大 (${formatFileSize(file.size)} > ${formatFileSize(maxUploadSize)})`);
        return;
      }
      
      // 检查数量限制
      if (images.length + validFiles.length >= maxImages) {
        errors.push(`已达到最大图片数量限制 (${maxImages})`);
        return;
      }
      
      validFiles.push(file);
    });
    
    if (errors.length > 0) {
      setError(errors.join('\n'));
    }
    
    if (validFiles.length > 0) {
      setUploadFiles(validFiles);
      setShowUploadDialog(true);
    }
    
    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 处理上传
  const handleUpload = async () => {
    if (!onUpload || uploading || uploadFiles.length === 0) return;
    
    setUploading(true);
    setError(null);
    
    try {
      // 模拟上传进度
      const progress: Record<string, number> = {};
      uploadFiles.forEach(file => {
        progress[file.name] = 0;
      });
      setUploadProgress(progress);
      
      // 模拟进度更新
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          Object.keys(newProgress).forEach(key => {
            if (newProgress[key] < 90) {
              newProgress[key] += 10;
            }
          });
          return newProgress;
        });
      }, 200);
      
      // 执行上传
      const newImages = await onUpload(uploadFiles);
      
      clearInterval(interval);
      
      // 更新进度为完成
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        Object.keys(newProgress).forEach(key => {
          newProgress[key] = 100;
        });
        return newProgress;
      });
      
      // 添加新图片
      setImages(prev => [...prev, ...newImages]);
      setSuccess(`成功上传 ${newImages.length} 张图片`);
      setShowUploadDialog(false);
      setUploadFiles([]);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '上传失败');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  // 处理删除
  const handleDelete = async () => {
    if (!onDelete || deleting || selectedImages.size === 0) return;
    
    if (!confirm(`确定要删除选中的 ${selectedImages.size} 张图片吗？`)) {
      return;
    }
    
    setDeleting(true);
    setError(null);
    
    try {
      await onDelete(Array.from(selectedImages));
      
      // 从状态中移除
      setImages(prev => prev.filter(img => !selectedImages.has(img.id)));
      setSelectedImages(new Set());
      setSuccess(`成功删除 ${selectedImages.size} 张图片`);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '删除失败');
    } finally {
      setDeleting(false);
    }
  };

  // 处理编辑
  const handleEdit = (image: ImageFile) => {
    setEditingImage(image);
    setEditForm({
      name: image.name,
      description: image.description || '',
      tags: [...image.tags],
      altText: image.altText || '',
      caption: image.caption || '',
      isPublic: image.isPublic,
    });
    setShowEditDialog(true);
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!onUpdate || !editingImage || updating) return;
    
    setUpdating(true);
    setError(null);
    
    try {
      await onUpdate(editingImage.id, editForm);
      
      // 更新状态
      setImages(prev => prev.map(img => 
        img.id === editingImage.id 
          ? { ...img, ...editForm }
          : img
      ));
      
      setSuccess('图片信息更新成功');
      setShowEditDialog(false);
      setEditingImage(null);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '更新失败');
    } finally {
      setUpdating(false);
    }
  };

  // 处理选择
  const handleSelect = (image: ImageFile) => {
    if (multiple) {
      const newSelected = new Set(selectedImages);
      if (newSelected.has(image.id)) {
        newSelected.delete(image.id);
      } else {
        newSelected.add(image.id);
      }
      setSelectedImages(newSelected);
    } else {
      setSelectedImages(new Set([image.id]));
      if (onSelect) {
        onSelect(image);
      }
    }
  };

  // 复制图片URL
  const handleCopyUrl = (image: ImageFile) => {
    navigator.clipboard.writeText(image.url)
      .then(() => {
        setSuccess('图片URL已复制到剪贴板');
        setTimeout(() => setSuccess(null), 2000);
      })
      .catch(() => {
        setError('复制失败');
      });
  };

  // 下载图片
  const handleDownload = (image: ImageFile) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 权限检查
  if (requireAuth && status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">检查权限...</span>
      </div>
    );
  }

  if (requireAuth && status === 'unauthenticated') {
    return (
      <div className="text-center p-8">
        <Lock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          需要登录
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          请登录后管理图片
        </p>
      </div>
    );
  }

  if (error && error.includes('需要') && error.includes('权限')) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          权限不足
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
      {/* 顶部工具栏 */}
      <div className="border-b border-gray-300 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* 左侧操作 */}
          <div className="flex items-center gap-2">
            {showUpload && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || images.length >= maxImages}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  上传图片
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={allowedFormats.join(',')}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </>
            )}
            
            {showDelete && selectedImages.size > 0 && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除选中 ({selectedImages.size})
              </button>
            )}
          </div>
          
          {/* 右侧控制 */}
          <div className="flex items-center gap-4">
            {/* 搜索 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索图片..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent w-full md:w-64"
              />
            </div>
            
            {/* 视图模式 */}
            <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                title="网格视图"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                title="列表视图"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* 过滤和排序 */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {/* 标签过滤 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text