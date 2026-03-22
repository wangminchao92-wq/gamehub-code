import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
}: OptimizedImageProps) {
  // 检查是否是外部图片
  const isExternal = src.startsWith('http') || src.startsWith('//');
  
  // 如果是外部图片，使用原生img标签
  if (isExternal) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`rounded-lg ${className}`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    );
  }
  
  // 如果是本地图片，使用优化后的img标签
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg ${className}`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  );
}