import { Button } from "flowbite-react";

const PrevNextNavigation: React.FC<{
    onPrevClick: () => void;
    onNextClick: () => void;
    prevLabel?: string;
    nextLabel?: string;
    disabled?: boolean;
}> = ({ onPrevClick, onNextClick, prevLabel = "Previous", nextLabel = "Next", disabled = false }) => {
    return (
        <div className="w-full gap-4 flex my-5 pb-5">
            <Button className="grow" color="gray" onClick={onPrevClick}>
                {prevLabel}
            </Button>
            <Button className="grow" color="blue" onClick={onNextClick} disabled={disabled}>
                {nextLabel}
            </Button>
        </div>
    );
}

export default PrevNextNavigation;