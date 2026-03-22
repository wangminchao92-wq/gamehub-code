import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CommunityRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/community/simple');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">正在跳转到社区页面...</p>
      </div>
    </div>
  );
}