import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import useSensorDropdownState from "@/hooks/dashboard/useSensorDropdownState";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { useMemo } from "react";
import { flattenSurveyQuestions } from "@/services/chartService";

/**
 * Whole-sensor / whole-survey picker: selecting an item toggles all of its
 * underlying field/question ids at once. For picking individual fields or
 * questions, use SensorFieldDropdown instead.
 */
const SensorDropdown: React.FC<{
    className?: string;
    selectedFieldIds: number[];
    selectedQuestionIds: number[];
    setSelectedFieldIds: (fieldIds: number[]) => void;
    setSelectedQuestionIds: (questionIds: number[]) => void;
}> = ({ className, selectedFieldIds, selectedQuestionIds, setSelectedFieldIds, setSelectedQuestionIds }) => {
    const { campaign, campaignTables } = useCampaignStore((state) => state);
    const surveys = useMemo(() => campaign?.survey ?? [], [campaign?.survey]);
    const flatQuestions = useMemo(() => flattenSurveyQuestions(surveys), [surveys]);

    const {
        dropdownLabel,
        isTableSelected,
        toggleTable,
        isSurveySelected,
        toggleSurvey,
        isAllSelected,
        toggleAll,
    } = useSensorDropdownState(
        selectedFieldIds,
        campaignTables,
        setSelectedFieldIds,
        selectedQuestionIds,
        surveys,
        flatQuestions,
        setSelectedQuestionIds,
    );

    return (
        <Dropdown
            label={dropdownLabel}
            placement="bottom-start"
            dismissOnClick={false}
            className={className}
        >
            <div className="h-64 min-w-56 flex flex-col px-2 py-2">
                <div className="overflow-y-auto grow scrollbar-thin">
                    {Array.from(campaignTables.values()).map((table) => (
                        <DropdownItem
                            key={`table-${table.id}`}
                            className={isTableSelected(table.id) ? "text-blue-600 bg-gray-100" : "text-gray-700"}
                            onClick={() => toggleTable(table.id)}
                        >
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={isTableSelected(table.id)}
                                onChange={() => { }}
                            />
                            <span className="truncate">{table.display_name}</span>
                        </DropdownItem>
                    ))}
                    {surveys.length > 0 && (
                        <>
                            <DropdownDivider />
                            <div className="px-3 py-1 text-xs uppercase text-gray-400">Surveys</div>
                            {surveys.map((survey) => (
                                <DropdownItem
                                    key={`survey-${survey.id}`}
                                    className={isSurveySelected(survey.id) ? "text-blue-600 bg-gray-100" : "text-gray-700"}
                                    onClick={() => toggleSurvey(survey.id)}
                                >
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={isSurveySelected(survey.id)}
                                        onChange={() => { }}
                                    />
                                    <span className="truncate">{survey.title}</span>
                                </DropdownItem>
                            ))}
                        </>
                    )}
                </div>
                <DropdownDivider />
                <DropdownItem className={`font-bold ${isAllSelected ? 'text-red-500' : ''}`} onClick={toggleAll}>
                    {isAllSelected ? "Deselect all" : "Select all"}
                </DropdownItem>
            </div>
        </Dropdown>
    );
};

export default SensorDropdown;
