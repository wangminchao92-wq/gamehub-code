'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Send, 
  Eye, 
  X, 
  Image as ImageIcon,
  Tag,
  Folder,
  Star,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface ArticleEditorProps {
  article?: {
    id?: string;
    title: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    type: 'NEWS' | 'REVIEW' | 'GUIDE' | 'VIDEO' | 'BLOG';
    categoryId?: string;
    tags?: string[];
    status: 'DRAFT' | 'PENDING' | 'PUBLISHED';
    featured: boolean;
    pinned: boolean;
    rating?: number;
  };
  categories: Array<{ id: string; name: string; slug: string }>;
  tags: Array<{ id: string; name: string; slug: string }>;
  onSave?: (data: any) => Promise<void>;
  onPublish?: (data: any) => Promise<void>;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({
  article,
  categories,
  tags,
  onSave,
  onPublish,
}) => {
  const router = useRouter();
  
  // 表单状态
  const [formData, setFormData] = useState({
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    coverImage: article?.coverImage || '',
    type: article?.type || 'NEWS',
    categoryId: article?.categoryId || '',
    tags: article?.tags || [] as string[],
    status: article?.status || 'DRAFT',
    featured: article?.featured || false,
    pinned: article?.pinned || false,
    rating: article?.rating || 0,
  });
  
  // UI状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newTag, setNewTag] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  
  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // 清除错误和成功消息
    if (error) setError('');
    if (success) setSuccess('');
  };
  
  // 处理标签添加
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };
  
  // 处理标签删除
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // 处理标签按键
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  // 保存草稿
  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      setError('');
      
      const dataToSave = {
        ...formData,
        status: 'DRAFT'
      };
      
      if (onSave) {
        await onSave(dataToSave);
      } else {
        // 默认保存逻辑
        const method = article?.id ? 'PUT' : 'POST';
        const url = article?.id ? `/api/articles/${article.id}` : '/api/articles';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSave),
        });
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || '保存失败');
        }
        
        setSuccess('草稿保存成功');
        
        // 如果是新建文章，重定向到编辑页面
        if (!article?.id && result.data?.id) {
          setTimeout(() => {
            router.push(`/admin/articles/edit/${result.data.id}`);
          }, 1500);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 发布文章
  const handlePublish = async () => {
    try {
      setLoading(true);
      setError('');
      
      const dataToPublish = {
        ...formData,
        status: 'PUBLISHED'
      };
      
      if (onPublish) {
        await onPublish(dataToPublish);
      } else {
        // 默认发布逻辑
        const method = article?.id ? 'PUT' : 'POST';
        const url = article?.id ? `/api/articles/${article.id}` : '/api/articles';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToPublish),
        });
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || '发布失败');
        }
        
        setSuccess('文章发布成功');
        
        // 重定向到文章页面
        setTimeout(() => {
          router.push(`/news/${result.data.slug}`);
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '发布失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 预览内容
  const renderPreview = () => {
    return (
      <div className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold text-white mb-4">{formData.title}</h1>
        
        {formData.excerpt && (
          <div className="text-gray-300 text-lg mb-6 p-4 bg-gray-800/50 rounded-lg">
            {formData.excerpt}
          </div>
        )}
        
        {formData.coverImage && (
          <div className="mb-6">
            <img 
              src={formData.coverImage} 
              alt={formData.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="text-gray-300 whitespace-pre-wrap">
          {formData.content}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-900 rounded-xl p-6">
      {/* 消息提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-green-400">{success}</p>
          </div>
        </div>
      )}
      
      {/* 编辑器头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {article?.id ? '编辑文章' : '新建文章'}
          </h2>
          <p className="text-gray-400 text-sm">
            {article?.id ? `文章ID: ${article.id}` : '创建新的内容'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? '编辑模式' : '预览模式'}
          </button>
        </div>
      </div>
      
      {previewMode ? (
        // 预览模式
        <div className="mb-6">
          {renderPreview()}
        </div>
      ) : (
        // 编辑模式
        <div className="space-y-6">
          {/* 基本设置 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 标题 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                文章标题 *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="请输入文章标题"
                required
              />
            </div>
            
            {/* 摘要 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                文章摘要
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="请输入文章摘要（可选）"
              />
            </div>
            
            {/* 封面图片 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                封面图片 URL
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="flex-grow px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors flex items-center"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  上传
                </button>
              </div>
              {formData.coverImage && (
                <div className="mt-3">
                  <img 
                    src={formData.coverImage} 
                    alt="封面预览"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            
            {/* 文章类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                文章类型 *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              >
                <option value="NEWS">新闻</option>
                <option value="REVIEW">评测</option>
                <option value="GUIDE">攻略</option>
                <option value="VIDEO">视频</option>
                <option value="BLOG">博客</option>
              </select>
            </div>
            
            {/* 分类 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                分类
              </label>
              <div className="flex items-center">
                <Folder className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">选择分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* 评分（仅评测类型） */}
            {formData.type === 'REVIEW' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  评分
                </label>
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <input
                    type="range"
                    name="rating"
                    min="0"
                    max="10"
                    step="0.5"
                    value={formData.rating}
                    onChange={handleChange}
                    className="flex-grow"
                  />
                  <span className="text-2xl font-bold text-white w-16 text-center">
                    {formData.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* 标签管理 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              标签
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map(tag => (
                <div
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-gray-400 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="输入标签并按Enter添加"
                className="flex-grow px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                添加
              </button>
            </div>
          </div>
          
          {/* 内容编辑器 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              文章内容 *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={15}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-mono"
              placeholder="请输入文章内容（支持Markdown格式）"
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              支持Markdown格式，可以使用 **粗体**、*斜体*、[链接](url)、`代码`等
            </p>
          </div>
          
          {/* 高级设置 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-4">高级设置</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-500 rounded focus:ring-primary-500 border-gray-700"
                />
                <span className="text-gray-300">设为推荐文章</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="pinned"
                  checked={formData.pinned}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-500 rounded focus:ring-primary-500 border-gray-700"
                />
                <span className="text-gray-300">置顶显示</span>
              </label>
            </div>
          </div>
        </div>
      )}
      
      {/* 操作按钮 */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-800">
        <div className="text-sm text-gray-500">
          状态: <span className="font-medium text-gray-300">
            {formData.status === 'DRAFT' ? '草稿' : 
             formData.status === 'PENDING' ? '待审核' : '已发布'}
          </span>
          {article?.id && (
            <span className="ml-4">
              最后更新: {new Date().toLocaleDateString('zh-CN')}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            取消
          </button>
          
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={loading || !formData.title || !formData.content}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            保存草稿
          </button>
          
          <button
            type="button"
            onClick={handlePublish}
            disabled={loading || !formData.title || !formData.content}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            发布文章
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
