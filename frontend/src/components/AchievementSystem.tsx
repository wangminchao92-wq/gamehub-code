import React from 'react';

interface AchievementSystemProps {
  userId?: string;
  onUnlock?: (achievementId: string) => void;
  onShare?: (achievementId: string) => void;
  requireAuth?: boolean;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  userId,
  onUnlock,
  onShare,
  requireAuth = false
}) => {
  // 简化版本，只显示基本UI
  return (
    <div className="achievement-system p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-4">成就系统</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="achievement-item p-3 border rounded text-center">
          <div className="text-2xl mb-2">🏆</div>
          <div className="font-medium">初来乍到</div>
          <div className="text-sm text-gray-500">首次登录</div>
        </div>
        <div className="achievement-item p-3 border rounded text-center">
          <div className="text-2xl mb-2">💬</div>
          <div className="font-medium">活跃用户</div>
          <div className="text-sm text-gray-500">发布5个帖子</div>
        </div>
        <div className="achievement-item p-3 border rounded text-center">
          <div className="text-2xl mb-2">👑</div>
          <div className="font-medium">社区领袖</div>
          <div className="text-sm text-gray-500">获得50个赞</div>
        </div>
        <div className="achievement-item p-3 border rounded text-center">
          <div className="text-2xl mb-2">⭐</div>
          <div className="font-medium">资深玩家</div>
          <div className="text-sm text-gray-500">连续登录30天</div>
        </div>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        完成成就解锁更多奖励！
      </div>
    </div>
  );
};

export default AchievementSystem;