import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

const PrevNextNavigation: React.FC<{
  onNextClick: () => void;
  /**
   * The previous wizard step. Previous used to be browser Back, which on the first
   * step left the wizard (discarding everything) and after a sidebar jump went to
   * the wrong step. Omit it on the first step to hide Previous.
   */
  prevHref?: string;
  prevLabel?: string;
  nextLabel?: string;
  disabled?: boolean;
  /** Shown under the buttons while Next is disabled, so users know what to fix. */
  disabledReason?: string | null;
}> = ({ onNextClick, prevHref, prevLabel = "Previous", nextLabel = "Next", disabled = false, disabledReason }) => {
  const router = useRouter();
  return (
    <div className="my-5 flex w-full flex-col gap-2 pb-5">
      <div className="flex w-full gap-4">
        {prevHref && (
          <Button className="grow" color="gray" onClick={() => router.push(prevHref)}>
            {prevLabel}
          </Button>
        )}
        <Button className="grow" color="blue" onClick={onNextClick} disabled={disabled}>
          {nextLabel}
        </Button>
      </div>
      {disabled && disabledReason && (
        <p className="text-right text-sm text-red-600" aria-live="polite">
          {disabledReason}
        </p>
      )}
    </div>
  );
};

export default PrevNextNavigation;
