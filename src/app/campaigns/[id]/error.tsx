"use client";

import ErrorFallback from "@/components/common/ErrorFallback";

// Catches errors in the dashboard, download and settings pages while keeping
// the campaign sidebar (rendered by the parent layout) on screen.
export default function CampaignError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <ErrorFallback error={error} actions={[{ label: "Try again", onClick: () => retry(), primary: true }]} />
  );
}
