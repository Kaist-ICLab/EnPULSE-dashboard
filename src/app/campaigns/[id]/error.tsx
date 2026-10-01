"use client";

import ErrorFallback from "@/components/common/ErrorFallback";

// Catches errors in the dashboard, download and settings pages while keeping
// the campaign sidebar (rendered by the parent layout) on screen.
export default function CampaignError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <ErrorFallback error={error} actions={[{ label: "Try again", onClick: () => unstable_retry(), primary: true }]} />
  );
}
