'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Code, Link, Image as ImageIcon,
  Table, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Save, Send, Eye, X,
  Type, Palette, Paperclip, Smile,
  CheckCircle, AlertCircle, Loader2, Lock, Globe
} from 'lucide-react';

interface RichTextEditorProps {
  initialContent?: string;
  onSave?: (content: string, metadata?: any) => Promise<void>;
  onPublish?: (content: string, metadata?: any) => Promise<void>;
  autoSaveInterval?: number; // 自动保存间隔（毫秒）
  maxLength?: number; // 最大字符数
  minLength?: number; // 最小字符数
  allowedTags?: string[]; // 允许的HTML标签
  disabled?: boolean; // 是否禁用
  placeholder?: string; // 占位符文本
  showToolbar?: boolean; // 是否显示工具栏
  showStatusBar?: boolean; // 是否显示状态栏
  showWordCount?: boolean; // 是否显示字数统计
  requireAuth?: boolean; // 是否需要认证
  requiredRole?: string; // 需要的角色
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent = '',
  onSave,
  onPublish,
  autoSaveInterval = 30000, // 30秒自动保存
  maxLength = 10000,
  minLength = 100,
  allowedTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'ul', 'ol', 'li', 'a', 'img', 'strong', 'em', 'u', 's', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
  disabled = false,
  placeholder = '开始写作...',
  showToolbar = true,
  showStatusBar = true,
  showWordCount = true,
  requireAuth = true,
  requiredRole = 'EDITOR',
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(initialContent);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [history, setHistory] = useState<string[]>([initialContent]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // 检查权限
  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
    }
    
    if (requireAuth && status === 'authenticated' && requiredRole) {
      const userRole = session?.user?.role;
      const roleHierarchy = ['USER', 'EDITOR', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'];
      const userLevel = roleHierarchy.indexOf(userRole || 'USER');
      const requiredLevel = roleHierarchy.indexOf(requiredRole);
      
      if (userLevel < requiredLevel) {
        setError(`需要${requiredRole}权限才能使用编辑器`);
        disabled = true;
      }
    }
  }, [session, status, requireAuth, requiredRole, router]);

  // 字数统计
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, ''); // 移除HTML标签
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const chars = text.length;
    const readingTime = Math.ceil(words.length / 200); // 假设200字/分钟
    
    setWordCount(words.length);
    setCharCount(chars);
    setReadTime(readingTime);
    
    // 检查长度限制
    if (maxLength && chars > maxLength) {
      setError(`内容超过最大长度限制 (${maxLength}字符)`);
    } else if (minLength && chars < minLength) {
      setError(`内容需要至少${minLength}字符`);
    } else {
      setError(null);
    }
  }, [content, maxLength, minLength]);

  // 自动保存
  useEffect(() => {
    if (!isDirty || !autoSaveInterval || !onSave) return;
    
    const timer = setTimeout(async () => {
      if (content.trim() && !isSaving) {
        await handleSave('auto');
      }
    }, autoSaveInterval);
    
    return () => clearTimeout(timer);
  }, [content, isDirty, autoSaveInterval, onSave]);

  // 历史记录
  const addToHistory = (newContent: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // 撤销
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevContent = history[historyIndex - 1];
      setContent(prevContent);
      setHistoryIndex(historyIndex - 1);
      setIsDirty(true);
    }
  };

  // 重做
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextContent = history[historyIndex + 1];
      setContent(nextContent);
      setHistoryIndex(historyIndex + 1);
      setIsDirty(true);
    }
  };

  // 编辑器命令
  const execCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      updateContent();
    }
  };

  // 更新内容
  const updateContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      if (newContent !== content) {
        setContent(newContent);
        setIsDirty(true);
        addToHistory(newContent);
      }
    }
  };

  // 处理输入
  const handleInput = () => {
    updateContent();
  };

  // 处理粘贴（清理HTML）
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    // 简单的HTML清理
    const cleanText = text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
    
    document.execCommand('insertText', false, cleanText);
    updateContent();
  };

  // 插入图片
  const handleInsertImage = () => {
    if (!imageUrl.trim()) {
      setError('请输入图片URL');
      return;
    }

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = imageAlt || '图片';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, img.outerHTML);
      updateContent();
      setShowImageUpload(false);
      setImageUrl('');
      setImageAlt('');
    }
  };

  // 插入链接
  const handleInsertLink = () => {
    if (!linkUrl.trim()) {
      setError('请输入链接URL');
      return;
    }

    const linkTextToUse = linkText.trim() || linkUrl;
    const link = document.createElement('a');
    link.href = linkUrl;
    link.textContent = linkTextToUse;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, link.outerHTML);
      updateContent();
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  // 保存
  const handleSave = async (type: 'manual' | 'auto' = 'manual') => {
    if (!onSave || isSaving) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      const metadata = {
        wordCount,
        charCount,
        readTime,
        lastSaved: new Date().toISOString(),
        saveType: type,
      };
      
      await onSave(content, metadata);
      
      setLastSaved(new Date());
      setIsDirty(false);
      
      if (type === 'manual') {
        setSuccess('保存成功');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  // 发布
  const handlePublish = async () => {
    if (!onPublish || isPublishing) return;
    
    // 验证内容
    if (charCount < minLength) {
      setError(`内容需要至少${minLength}字符`);
      return;
    }
    
    if (maxLength && charCount > maxLength) {
      setError(`内容超过最大长度限制 (${maxLength}字符)`);
      return;
    }
    
    setIsPublishing(true);
    setError(null);
    
    try {
      const metadata = {
        wordCount,
        charCount,
        readTime,
        publishedAt: new Date().toISOString(),
      };
      
      await onPublish(content, metadata);
      
      setSuccess('发布成功');
      setIsDirty(false);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '发布失败');
    } finally {
      setIsPublishing(false);
    }
  };

  // 格式化工具栏按钮
  const toolbarButtons = [
    { command: 'bold', icon: <Bold className="w-4 h-4" />, title: '加粗 (Ctrl+B)' },
    { command: 'italic', icon: <Italic className="w-4 h-4" />, title: '斜体 (Ctrl+I)' },
    { command: 'underline', icon: <Underline className="w-4 h-4" />, title: '下划线 (Ctrl+U)' },
    { command: 'strikethrough', icon: <Strikethrough className="w-4 h-4" />, title: '删除线' },
    { separator: true },
    { command: 'formatBlock', value: 'h1', icon: <Heading1 className="w-4 h-4" />, title: '标题1' },
    { command: 'formatBlock', value: 'h2', icon: <Heading2 className="w-4 h-4" />, title: '标题2' },
    { command: 'formatBlock', value: 'h3', icon: <Heading3 className="w-4 h-4" />, title: '标题3' },
    { separator: true },
    { command: 'insertUnorderedList', icon: <List className="w-4 h-4" />, title: '无序列表' },
    { command: 'insertOrderedList', icon: <ListOrdered className="w-4 h-4" />, title: '有序列表' },
    { separator: true },
    { command: 'formatBlock', value: 'blockquote', icon: <Quote className="w-4 h-4" />, title: '引用' },
    { command: 'formatBlock', value: 'pre', icon: <Code className="w-4 h-4" />, title: '代码块' },
    { separator: true },
    { action: 'link', icon: <Link className="w-4 h-4" />, title: '插入链接' },
    { action: 'image', icon: <ImageIcon className="w-4 h-4" />, title: '插入图片' },
    { separator: true },
    { command: 'justifyLeft', icon: <AlignLeft className="w-4 h-4" />, title: '左对齐' },
    { command: 'justifyCenter', icon: <AlignCenter className="w-4 h-4" />, title: '居中对齐' },
    { command: 'justifyRight', icon: <AlignRight className="w-4 h-4" />, title: '右对齐' },
    { separator: true },
    { action: 'undo', icon: <Undo className="w-4 h-4" />, title: '撤销 (Ctrl+Z)' },
    { action: 'redo', icon: <Redo className="w-4 h-4" />, title: '重做 (Ctrl+Y)' },
  ];

  // 键盘快捷键
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+S 保存
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave('manual');
    }
    
    // Ctrl+P 发布
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      handlePublish();
    }
    
    // Ctrl+Z 撤销
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    }
    
    // Ctrl+Y 或 Ctrl+Shift+Z 重做
    if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
      e.preventDefault();
      handleRedo();
    }
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
          请登录后使用编辑器
        </p>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          立即登录
        </button>
      </div>
    );
  }

  if (disabled) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          编辑器已禁用
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {error || '您没有权限使用此编辑器'}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      {/* 工具栏 */}
      {showToolbar && (
        <div className="border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2">
          <div className="flex flex-wrap items-center gap-1">
            {toolbarButtons.map((btn, index) => {
              if (btn.separator) {
                return <div key={`separator-${index}`} className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />;
              }
              
              if (btn.action) {
                return (
                  <button
                    key={btn.action}
                    onClick={() => {
                      if (btn.action === 'undo') handleUndo();
                      if (btn.action === 'redo') handleRedo();
                      if (btn.action === 'link') setShowLinkDialog(true);
                      if (btn.action === 'image') setShowImageUpload(true);
                    }}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title={btn.title}
                    disabled={disabled}
                  >
                    {btn.icon}
                  </button>
                );
              }
              
              return (
                <button
                  key={`${btn.command}-${btn.value || ''}`}
                  onClick={() => execCommand(btn.command, btn.value)}
                  className="p-2 rounded