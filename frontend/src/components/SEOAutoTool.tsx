'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, BarChart, TrendingUp, CheckCircle, AlertCircle,
  Edit2, Copy, RefreshCw, Download, Share2, Globe,
  Hash, Tag, Type, Link, Image as ImageIcon,
  Eye, Clock, Users, Star, Zap, Loader2
} from 'lucide-react';

interface SEOAnalysis {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  wordCount: number;
  headingStructure: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  images: {
    total: number;
    withAlt: number;
    optimized: number;
  };
  links: {
    internal: number;
    external: number;
    broken: number;
  };
  mobileFriendly: boolean;
  loadTime: number;
  score: number; // 0-100
  issues: SEOIssue[];
  suggestions: SEOSuggestion[];
  structuredData: StructuredData[];
}

interface SEOIssue {
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  fix: string;
  priority: number; // 1-5, 5为最高
}

interface SEOSuggestion {
  type: 'IMPROVEMENT' | 'OPTIMIZATION' | 'ENHANCEMENT';
  message: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface StructuredData {
  type: string;
  valid: boolean;
  errors?: string[];
}

interface SEOAutoToolProps {
  url?: string;
  content?: string;
  onAnalyze?: (url: string) => Promise<SEOAnalysis>;
  onOptimize?: (analysis: SEOAnalysis, optimizations: any) => Promise<void>;
  onGenerate?: (type: 'title' | 'description' | 'keywords') => Promise<string[]>;
  autoOptimize?: boolean;
  showDetails?: boolean;
  language?: string;
  targetKeywords?: string[];
}

const SEOAutoTool: React.FC<SEOAutoToolProps> = ({
  url: initialUrl = '',
  content = '',
  onAnalyze,
  onOptimize,
  onGenerate,
  autoOptimize = true,
  showDetails = true,
  language = 'zh-CN',
  targetKeywords = [],
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const [optimizations, setOptimizations] = useState<any>({});
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [generatedDescriptions, setGeneratedDescriptions] = useState<string[]>([]);
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [comparisonUrl, setComparisonUrl] = useState('');

  // 模拟分析函数（如果没有提供onAnalyze）
  const analyzeUrl = async (targetUrl: string): Promise<SEOAnalysis> => {
    if (onAnalyze) {
      return await onAnalyze(targetUrl);
    }
    
    // 模拟分析结果
    return {
      url: targetUrl,
      title: targetUrl.includes('gamehub') ? 'GameHub - 游戏社区平台' : '示例页面标题',
      description: targetUrl.includes('gamehub') 
        ? 'GameHub是一个现代化的游戏社区平台，提供游戏新闻、攻略、讨论和社交功能。'
        : '这是一个示例页面描述，用于SEO分析演示。',
      keywords: targetUrl.includes('gamehub') 
        ? ['游戏社区', '游戏新闻', '游戏攻略', '玩家交流', '电竞赛事']
        : ['示例', '关键词', '测试'],
      wordCount: Math.floor(Math.random() * 1000) + 500,
      headingStructure: {
        h1: 1,
        h2: Math.floor(Math.random() * 5) + 2,
        h3: Math.floor(Math.random() * 10) + 5,
        h4: Math.floor(Math.random() * 15) + 3,
        h5: 0,
        h6: 0,
      },
      images: {
        total: Math.floor(Math.random() * 10) + 3,
        withAlt: Math.floor(Math.random() * 8) + 2,
        optimized: Math.floor(Math.random() * 6) + 1,
      },
      links: {
        internal: Math.floor(Math.random() * 20) + 10,
        external: Math.floor(Math.random() * 10) + 3,
        broken: Math.floor(Math.random() * 3),
      },
      mobileFriendly: Math.random() > 0.2,
      loadTime: Math.floor(Math.random() * 3000) + 500,
      score: Math.floor(Math.random() * 40) + 60, // 60-100分
      issues: [
        {
          type: 'WARNING',
          message: '页面标题长度不理想',
          fix: '将标题长度调整到50-60字符之间',
          priority: 3,
        },
        {
          type: 'CRITICAL',
          message: '缺少H1标签',
          fix: '添加一个H1标签包含主要关键词',
          priority: 5,
        },
        {
          type: 'INFO',
          message: '图片alt属性不完整',
          fix: '为所有图片添加描述性alt文本',
          priority: 2,
        },
      ],
      suggestions: [
        {
          type: 'IMPROVEMENT',
          message: '添加更多内部链接',
          impact: 'MEDIUM',
          effort: 'LOW',
        },
        {
          type: 'OPTIMIZATION',
          message: '压缩图片大小',
          impact: 'HIGH',
          effort: 'MEDIUM',
        },
        {
          type: 'ENHANCEMENT',
          message: '添加结构化数据',
          impact: 'MEDIUM',
          effort: 'HIGH',
        },
      ],
      structuredData: [
        {
          type: 'WebPage',
          valid: true,
        },
        {
          type: 'BreadcrumbList',
          valid: Math.random() > 0.5,
          errors: Math.random() > 0.5 ? ['缺少itemListElement属性'] : undefined,
        },
      ],
    };
  };

  // 执行分析
  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('请输入URL');
      return;
    }
    
    setAnalyzing(true);
    setError(null);
    setAnalysis(null);
    
    try {
      const result = await analyzeUrl(url);
      setAnalysis(result);
      
      // 自动选择高优先级问题
      const highPriorityIssues = new Set(
        result.issues
          .filter(issue => issue.priority >= 4)
          .map((_, index) => index.toString())
      );
      setSelectedIssues(highPriorityIssues);
      
      // 自动选择高影响建议
      const highImpactSuggestions = new Set(
        result.suggestions
          .filter(suggestion => suggestion.impact === 'HIGH')
          .map((_, index) => index.toString())
      );
      setSelectedSuggestions(highImpactSuggestions);
      
      setSuccess('分析完成');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '分析失败');
    } finally {
      setAnalyzing(false);
    }
  };

  // 生成优化内容
  const handleGenerate = async (type: 'title' | 'description' | 'keywords') => {
    if (!analysis) return;
    
    setGenerating(true);
    
    try {
      if (onGenerate) {
        const results = await onGenerate(type);
        
        switch (type) {
          case 'title':
            setGeneratedTitles(results);
            break;
          case 'description':
            setGeneratedDescriptions(results);
            break;
          case 'keywords':
            setGeneratedKeywords(results);
            break;
        }
      } else {
        // 模拟生成
        const mockResults = [
          `${analysis.title} - 最佳游戏社区`,
          `${analysis.title} | 最新游戏资讯和攻略`,
          `探索${analysis.title}的游戏世界`,
        ];
        
        switch (type) {
          case 'title':
            setGeneratedTitles(mockResults);
            break;
          case 'description':
            setGeneratedDescriptions(mockResults.map(t => `${t}。加入我们的社区，与全球玩家交流游戏心得和技巧。`));
            break;
          case 'keywords':
            setGeneratedKeywords([...analysis.keywords, '游戏平台', '玩家社区', '游戏讨论']);
            break;
        }
      }
      
      setSuccess(`${type === 'title' ? '标题' : type === 'description' ? '描述' : '关键词'}生成完成`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '生成失败');
    } finally {
      setGenerating(false);
    }
  };

  // 应用优化
  const handleOptimize = async () => {
    if (!analysis || !onOptimize) return;
    
    setOptimizing(true);
    setError(null);
    
    try {
      const selectedOptimizations = {
        issues: analysis.issues
          .filter((_, index) => selectedIssues.has(index.toString()))
          .map(issue => ({
            type: issue.type,
            message: issue.message,
            fix: issue.fix,
          })),
        suggestions: analysis.suggestions
          .filter((_, index) => selectedSuggestions.has(index.toString()))
          .map(suggestion => ({
            type: suggestion.type,
            message: suggestion.message,
          })),
        generatedContent: {
          titles: generatedTitles,
          descriptions: generatedDescriptions,
          keywords: generatedKeywords,
        },
      };
      
      await onOptimize(analysis, selectedOptimizations);
      
      setSuccess('优化已应用');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '优化失败');
    } finally {
      setOptimizing(false);
    }
  };

  // 导出报告
  const handleExport = () => {
    if (!analysis) return;
    
    const report = {
      analysis,
      selectedIssues: Array.from(selectedIssues),
      selectedSuggestions: Array.from(selectedSuggestions),
      generatedContent: {
        titles: generatedTitles,
        descriptions: generatedDescriptions,
        keywords: generatedKeywords,
      },
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setSuccess('报告已导出');
    setTimeout(() => setSuccess(null), 3000);
  };

  // 获取分数颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // 获取问题颜色
  const getIssueColor = (type: string) => {
    switch (type) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'INFO': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取影响颜色
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH': return 'text-red-600 dark:text-red-400';
      case 'MEDIUM': return 'text-yellow-600 dark:text-yellow-400';
      case 'LOW': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600';
    }
  };

  // 获取努力程度颜色
  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'LOW': return 'text-green-600 dark:text-green-400';
      case 'MEDIUM': return 'text-yellow-600 dark:text-yellow-400';
      case 'HIGH': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
      {/* 顶部控制栏 */}
      <div className="border-b border-gray-300 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              SEO自动化工具
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {autoOptimize && (
              <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-sm">
                <Zap className="w-3 h-3 inline mr-1" />
                自动优化
              </span>
            )}
          </div>
        </div>
        
        {/* URL输入和分析 */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="输入要分析的URL (例如: https://gamehub.com/article/123)"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !url.trim()}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <BarChart className="w-4 h-4 mr-2" />
                  分析SEO
                </>
              )}
            </button>
            
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg"
            >
              {showAdvanced ? '简化' : '高级'}
            </button>
          </div>
        </div>
        
        {/* 高级选项 */}
        {showAdvanced && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  目标关键词
                </label>
                <input
                  type="text"
                  value={targetKeywords.join(', ')}
                  onChange={(e) => {
                    // 这里可以处理关键词输入
                  }}
                  placeholder="游戏, 社区, 攻略, 新闻"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  对比URL
                </label>
                <input
                  type="url"
                  value={comparisonUrl}
                  onChange={(e) => setComparisonUrl(e.target.value)}
                  placeholder="输入对比URL"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 分析结果 */}
      {analysis && (
        <div className="p-6">
          {/* 分数和概览 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  SEO分数
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {analysis.url}
                </p>
              </div>
              
              <div className="text-right">
                <div className={`text-