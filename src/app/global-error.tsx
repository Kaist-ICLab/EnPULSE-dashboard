"use client";

import "./globals.css";
import ErrorFallback from "@/components/common/ErrorFallback";

// Replaces the root layout when it fails, so it must render its own <html>/<body>.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="relative m-auto min-h-screen w-full antialiased">
        <title>EnPULSE Dashboard</title>
        <ErrorFallback
          fullScreen
          error={error}
          actions={[{ label: "Try again", onClick: () => retry(), primary: true }]}
        />
      </body>
    </html>
  );
}
