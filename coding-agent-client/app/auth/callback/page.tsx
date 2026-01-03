'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setToken } from '@/lib/auth';
import { useAuthStore } from '@/lib/store/userStore';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get('token');
      console.log('[Callback] Token from URL:', token ? 'EXISTS' : 'MISSING');

      if (!token) {
        setError('No authentication token received. Please try logging in again.');
        setIsLoading(false);
        return;
      }

      try {
        // Store token
        setToken(token);
        console.log('[Callback] Token stored in localStorage');

        // Fetch and store user data
        console.log('[Callback] Fetching current user...');
        await fetchCurrentUser();
        console.log('[Callback] User fetched and stored');

        // Redirect to home page
        router.push('/');
      } catch (err) {
        console.error('[Callback] Error:', err);
        setError('Failed to process authentication. Please try again.');
        setIsLoading(false);
      }
    };

    handleAuth();
  }, [searchParams, router, fetchCurrentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6">
            <h1 className="text-lg font-semibold text-destructive mb-2">Authentication Failed</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <a
              href="/login"
              className="inline-flex items-center justify-center px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
