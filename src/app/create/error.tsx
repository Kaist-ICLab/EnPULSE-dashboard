"use client";

import ErrorFallback from "@/components/common/ErrorFallback";
import { useCampaignConfigEditStoreApi } from "@/providers/CampaignConfigEditStoreProvider";

// Rendered inside create/layout.tsx, so the wizard store survives the error.
// Retrying alone would re-render the same broken state, so the main recovery
// path is to undo the last edit; "Start over" reloads to get a fresh store.
export default function CreateCampaignError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const store = useCampaignConfigEditStoreApi();
  const canUndo = store.temporal.getState().pastStates.length > 0;

  return (
    <ErrorFallback
      error={error}
      title="The campaign editor hit a problem"
      description="Your last change could not be displayed. Undo it to continue where you left off, or start a new campaign."
      actions={[
        ...(canUndo
          ? [
              {
                label: "Undo last change",
                onClick: () => {
                  store.temporal.getState().undo();
                  reset();
                },
                primary: true,
              },
            ]
          : []),
        { label: "Start over", onClick: () => window.location.assign("/create/general"), primary: !canUndo },
      ]}
    />
  );
}
