import React from 'react';
import HomePageTouchOptimized from './index_touch_optimized';
import SEO from '@/components/SEO';

export default function HomeTouchTestPage() {
  return (
    <>
      <SEO
        title="触摸测试页面 - GameHub"
        description="GameHub触摸优化测试页面"
        keywords="触摸测试,移动端优化,用户体验测试"
        canonical="https://gamehub.com/home-touch-test"
        noindex={true}
        nofollow={true}
        robots="noindex, nofollow"
        author="GameHub"
        section="Testing"
        tags={["test", "touch optimization", "mobile testing"]}
      />
      <HomePageTouchOptimized />
    </>
  );
}