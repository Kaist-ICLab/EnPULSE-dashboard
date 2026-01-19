import { Button } from "flowbite-react";

const TimelineOverviewTabButton: React.FC<{
    isSelected: boolean;
    onClick: () => void
    children: React.ReactNode
}> = ({ isSelected, onClick, children }) => {
    return (
        <Button
            color="white"
            onClick={onClick}
            className={`border-b-2 ${isSelected ? 'border-b-black' : 'border-b-gray-300 text-gray-300'} rounded-none hover:bg-gray-100 cursor-pointer text-md outline-none box-shadow-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0`}
        >
            {children}
        </Button>
    )
}

export default TimelineOverviewTabButton;