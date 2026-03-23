import React from 'react';

interface BadgeSystemProps {
  userId?: string;
  onUnlock?: (badgeId: string) => void;
  onActivate?: (badgeId: string) => void;
  onShare?: (badgeId: string) => void;
  requireAuth?: boolean;
}

const BadgeSystem: React.FC<BadgeSystemProps> = ({
  userId,
  onUnlock,
  onActivate,
  onShare,
  requireAuth = false
}) => {
  return (
    <div className="badge-system p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-4">徽章系统</h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="badge-item p-2 border rounded text-center">
          <div className="text-xl mb-1">🆕</div>
          <div className="text-xs font-medium">新人徽章</div>
        </div>
        <div className="badge-item p-2 border rounded text-center">
          <div className="text-xl mb-1">💬</div>
          <div className="text-xs font-medium">评论家</div>
        </div>
        <div className="badge-item p-2 border rounded text-center">
          <div className="text-xl mb-1">🏆</div>
          <div className="text-xs font-medium">冠军</div>
        </div>
        <div className="badge-item p-2 border rounded text-center">
          <div className="text-xl mb-1">⭐</div>
          <div className="text-xs font-medium">明星用户</div>
        </div>
        <div className="badge-item p-2 border rounded text-center">
          <div className="text-xl mb-1">👑</div>
          <div className="text-xs font-medium">社区之王</div>
        </div>
        <div className="badge-item p-2 border rounded text-center">
          <div className="text-xl mb-1">🎯</div>
          <div className="text-xs font-medium">精准玩家</div>
        </div>
      </div>
      <div className="mt-3 text-center text-xs text-gray-600">
        收集徽章展示你的成就！
      </div>
    </div>
  );
};

export default BadgeSystem;