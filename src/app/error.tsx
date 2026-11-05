"use client";

import ErrorFallback from "@/components/common/ErrorFallback";

// Catches errors in /campaigns (list fetch) and /campaigns/[id]/layout.tsx
// (campaign fetch), which have no closer boundary above them.
export default function RootError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <ErrorFallback
      fullScreen
      error={error}
      actions={[{ label: "Try again", onClick: () => retry(), primary: true }]}
    />
  );
}
