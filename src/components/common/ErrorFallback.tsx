"use client";

import Link from "next/link";
import { useEffect } from "react";

export type ErrorFallbackAction = {
  label: string;
  onClick: () => void;
  primary?: boolean;
};

/**
 * Shared UI for the app's error.tsx boundaries. Server-side errors reach the
 * client with a redacted message in production, so the copy stays generic and
 * points at the most common booth cause (backend unreachable).
 */
const ErrorFallback: React.FC<{
  error: Error & { digest?: string };
  title?: string;
  description?: string;
  actions: ErrorFallbackAction[];
  fullScreen?: boolean;
}> = ({
  error,
  title = "Something went wrong",
  description = "This page could not be displayed. If this keeps happening, the EnPULSE server may be unreachable.",
  actions,
  fullScreen = false,
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={`flex w-full grow items-center justify-center bg-gray-50 p-8 ${fullScreen ? "h-screen" : ""}`}>
      <div className="max-w-lg text-center">
        <span className="icon-[uis--exclamation-circle] mb-4 h-12 w-12 text-red-500" />
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">{title}</h2>
        <p className="mb-6 text-gray-500">{description}</p>
        <div className="flex flex-row flex-wrap items-center justify-center gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={
                action.primary
                  ? "rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                  : "rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
              }
            >
              {action.label}
            </button>
          ))}
          <Link
            href="/campaigns"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
          >
            All campaigns
          </Link>
        </div>
        {error.digest && <p className="mt-6 text-xs text-gray-400">Error ID: {error.digest}</p>}
      </div>
    </div>
  );
};

export default ErrorFallback;
