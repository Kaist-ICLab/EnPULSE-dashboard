import { ComparisonType } from "@/types/chart";
import { Select } from "flowbite-react";

const SectionTypeSelect: React.FC<{
    selectedSection: ComparisonType;
    updateSelectedSection: (section: ComparisonType) => void;
}> = ({ selectedSection, updateSelectedSection }) => {
    const sectionTypeIcons = (section: ComparisonType) => {
        switch (section) {
            case ComparisonType.Sensors:
                return <span className="icon-[material-symbols--sensors-rounded]"></span>
            case ComparisonType.Participants:
                return <span className="icon-[material-symbols--person-rounded]"></span>
            case ComparisonType.Days:
                return <span className="icon-[material-symbols--today-rounded]"></span>
        }
    }

    return (<Select
        icon={() => sectionTypeIcons(selectedSection)}
        value={selectedSection}
        onChange={(e) => updateSelectedSection(e.target.value as ComparisonType)}
        theme={{
            field: {
                select: {
                    base: "block w-full disabled:opacity-50 !text-lg font-semibold w-48 !py-1.25",
                }
            }
        }}
    >
        <option
            value={ComparisonType.Sensors}
        >
            Sensors
        </option>
        <option
            value={ComparisonType.Participants}
        >
            Participants
        </option>
        <option
            value={ComparisonType.Days}
        >
            Days
        </option>
    </Select>)
}

export default SectionTypeSelect;