import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

const PrevNextNavigation: React.FC<{
  onNextClick: () => void;
  prevLabel?: string;
  nextLabel?: string;
  disabled?: boolean;
  /** Shown under the buttons while Next is disabled, so users know what to fix. */
  disabledReason?: string | null;
}> = ({ onNextClick, prevLabel = "Previous", nextLabel = "Next", disabled = false, disabledReason }) => {
  const router = useRouter();
  return (
    <div className="my-5 flex w-full flex-col gap-2 pb-5">
      <div className="flex w-full gap-4">
        <Button className="grow" color="gray" onClick={() => router.back()}>
          {prevLabel}
        </Button>
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
