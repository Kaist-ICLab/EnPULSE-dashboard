import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

const PrevNextNavigation: React.FC<{
  onNextClick: () => void;
  prevLabel?: string;
  nextLabel?: string;
  disabled?: boolean;
}> = ({ onNextClick, prevLabel = "Previous", nextLabel = "Next", disabled = false }) => {
  const router = useRouter();
  return (
    <div className="my-5 flex w-full gap-4 pb-5">
      <Button className="grow" color="gray" onClick={() => router.back()}>
        {prevLabel}
      </Button>
      <Button className="grow" color="blue" onClick={onNextClick} disabled={disabled}>
        {nextLabel}
      </Button>
    </div>
  );
};

export default PrevNextNavigation;
