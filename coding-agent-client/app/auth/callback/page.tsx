import { Suspense } from 'react';
import OAuthCallbackClient from './OAuthCallbackClient';

type SearchParams = {
  token?: string | string[];
};

export default function OAuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Processing authentication...</p>
          </div>
        </div>
      }
    >
      <OAuthCallbackClient searchParams={searchParams} />
    </Suspense>
  );
}
