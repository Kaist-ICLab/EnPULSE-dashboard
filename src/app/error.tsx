"use client";

import ErrorFallback from "@/components/common/ErrorFallback";

// Catches errors in /campaigns (list fetch) and /campaigns/[id]/layout.tsx
// (campaign fetch), which have no closer boundary above them.
export default function RootError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <ErrorFallback
      fullScreen
      error={error}
      actions={[{ label: "Try again", onClick: () => unstable_retry(), primary: true }]}
    />
  );
}
