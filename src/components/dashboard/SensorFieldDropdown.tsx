import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import useSensorFieldDropdownState from "@/hooks/dashboard/useSensorFieldDropdownState";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { useMemo } from "react";
import { flattenSurveyQuestions } from "@/services/chartService";

const NO_OP = () => { };

const SensorFieldDropdown: React.FC<{
    className?: string;
    selectedFieldIds: number[];
    selectedQuestionIds?: number[];
    setSelectedFieldIds: (fieldId: number[]) => void;
    setSelectedQuestionIds?: (questionId: number[]) => void;
    isMultipleSelection?: boolean;
    showSelectAllSensors?: boolean;
    showSurveys?: boolean;
}> = ({
    className,
    selectedFieldIds,
    selectedQuestionIds = [],
    setSelectedFieldIds,
    setSelectedQuestionIds = NO_OP,
    isMultipleSelection = false,
    showSelectAllSensors = false,
    showSurveys = true,
}) => {
        const { campaign, campaignTables, campaignTableFields } = useCampaignStore((state) => state);
        const surveys = useMemo(() => showSurveys ? (campaign?.survey ?? []) : [], [campaign?.survey, showSurveys]);
        const flatQuestions = useMemo(() => flattenSurveyQuestions(surveys), [surveys]);

        const {
            selectedSensor,
            setSelectedSensor,
            selectedSurvey,
            setSelectedSurvey,
            dropdownLabel,
            isAllFieldsSelected,
            isAllQuestionsSelected,
            isAllSensorsSelected,
            toggleFieldSelection,
            toggleQuestionSelection,
            toggleAllSensorsSelection,
            toggleAllFieldsSelection,
            toggleAllQuestionsSelection,
            selectedCountByTable,
            selectedCountBySurvey,
        } = useSensorFieldDropdownState(
            selectedFieldIds,
            campaignTables,
            campaignTableFields,
            setSelectedFieldIds,
            isMultipleSelection,
            selectedQuestionIds,
            surveys,
            flatQuestions,
            setSelectedQuestionIds,
        );

        const questionsForSelectedSurvey = useMemo(() => {
            if (selectedSurvey === -1) return [];
            return Array.from(flatQuestions.values()).filter(q => q.survey_id === selectedSurvey);
        }, [selectedSurvey, flatQuestions]);

        return (
            <Dropdown
                label={dropdownLabel}
                placement="bottom-start"
                dismissOnClick={false}
                onMouseUp={() => { setSelectedSensor(-1); setSelectedSurvey(-1); }}
                className={className}
            >
                <div className="h-64 flex flex-row px-2 py-2 gap-2">
                    {/* Left column: sensors then surveys */}
                    <div className="min-w-50 flex flex-col">
                        <div className="overflow-y-auto grow scrollbar-thin">
                            {Array.from(campaignTables.values()).map((table) => (
                                <DropdownItem
                                    key={`table-${table.id}`}
                                    className={`font-medium ${selectedSensor === table.id ? 'text-blue-500 bg-gray-100' : 'text-gray-700'}`}
                                    onClick={() => { setSelectedSensor(selectedSensor === table.id ? -1 : table.id) }}
                                >
                                    <span className="flex items-center">
                                        <span>{table.display_name}</span>
                                        {isMultipleSelection ? (
                                            (selectedCountByTable.get(table.id) || 0) > 0 && (
                                                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs w-5 h-5">
                                                    {selectedCountByTable.get(table.id)}
                                                </span>
                                            )
                                        ) : (
                                            (selectedCountByTable.get(table.id) || 0) > 0 && (
                                                <span className="ml-2 inline-flex w-2 h-2 rounded-full bg-blue-500" />
                                            )
                                        )}
                                    </span>
                                </DropdownItem>
                            ))}
                            {surveys.length > 0 && (
                                <>
                                    <DropdownDivider />
                                    <div className="px-3 py-1 text-xs uppercase text-gray-400">Surveys</div>
                                    {surveys.map(survey => (
                                        <DropdownItem
                                            key={`survey-${survey.id}`}
                                            className={`font-medium ${selectedSurvey === survey.id ? 'text-blue-500 bg-gray-100' : 'text-gray-700'}`}
                                            onClick={() => { setSelectedSurvey(selectedSurvey === survey.id ? -1 : survey.id) }}
                                        >
                                            <span className="flex items-center">
                                                <span>{survey.title}</span>
                                                {isMultipleSelection ? (
                                                    (selectedCountBySurvey.get(survey.id) || 0) > 0 && (
                                                        <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs w-5 h-5">
                                                            {selectedCountBySurvey.get(survey.id)}
                                                        </span>
                                                    )
                                                ) : (
                                                    (selectedCountBySurvey.get(survey.id) || 0) > 0 && (
                                                        <span className="ml-2 inline-flex w-2 h-2 rounded-full bg-blue-500" />
                                                    )
                                                )}
                                            </span>
                                        </DropdownItem>
                                    ))}
                                </>
                            )}
                        </div>
                        <DropdownDivider />
                        <SensorSelectionToggleButton
                            isMultipleSelection={isMultipleSelection}
                            showSelectAllSensors={showSelectAllSensors}
                            isAllSensorsSelected={isAllSensorsSelected}
                            toggleAllSensorsSelection={toggleAllSensorsSelection}
                            deselectAllSelectedFields={() => { setSelectedFieldIds([]); setSelectedQuestionIds([]); }}
                        />
                    </div>
                    {/* Right column: fields for the selected sensor table, or questions for the selected survey */}
                    {selectedSensor === -1 && selectedSurvey === -1 ? (
                        <div className="min-w-40 flex items-center justify-center bg-gray-50 rounded-sm">
                            <span className="text-gray-400 text-sm ">Select Sensor or Survey</span>
                        </div>
                    ) : selectedSensor !== -1 ? (
                        <div className="min-w-40 flex flex-col">
                            <div className="overflow-y-auto grow scrollbar-thin">
                                {campaignTables.get(selectedSensor)?.campaign_table_field.map((field) => (
                                    <DropdownItem key={field.id} className="bg-white" onClick={() => {
                                        toggleFieldSelection(field.id);
                                    }}>
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={selectedFieldIds.includes(field.id)}
                                            onChange={() => { }}
                                        />
                                        {field.name}
                                    </DropdownItem>
                                ))}
                            </div>
                            <DropdownDivider />
                            {isMultipleSelection && (
                                <DropdownItem className="font-bold" onClick={() => toggleAllFieldsSelection(selectedSensor)}>
                                    {
                                        (isAllFieldsSelected.get(selectedSensor) ?? false) ?
                                            "Deselect all fields" :
                                            "Select all fields"
                                    }
                                </DropdownItem>
                            )}
                        </div>
                    ) : (
                        <div className="min-w-40 flex flex-col">
                            <div className="overflow-y-auto grow scrollbar-thin">
                                {questionsForSelectedSurvey.map(question => (
                                    <DropdownItem key={`q-${question.id}`} className="bg-white" onClick={() => {
                                        toggleQuestionSelection(question.id);
                                    }}>
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={selectedQuestionIds.includes(question.id)}
                                            onChange={() => { }}
                                        />
                                        <span className="truncate">{question.question}</span>
                                    </DropdownItem>
                                ))}
                            </div>
                            <DropdownDivider />
                            {isMultipleSelection && (
                                <DropdownItem className="font-bold" onClick={() => toggleAllQuestionsSelection(selectedSurvey)}>
                                    {
                                        (isAllQuestionsSelected.get(selectedSurvey) ?? false) ?
                                            "Deselect all questions" :
                                            "Select all questions"
                                    }
                                </DropdownItem>
                            )}
                        </div>
                    )}
                </div>
            </Dropdown>
        );
    };

const SensorSelectionToggleButton: React.FC<{
    isMultipleSelection: boolean,
    showSelectAllSensors: boolean,
    isAllSensorsSelected: boolean,
    deselectAllSelectedFields: () => void,
    toggleAllSensorsSelection: () => void,
}> = ({ isMultipleSelection, showSelectAllSensors, isAllSensorsSelected, deselectAllSelectedFields, toggleAllSensorsSelection }) => {
    if (showSelectAllSensors) {
        return (
            <DropdownItem className={`font-bold ${isAllSensorsSelected ? 'text-red-500' : ''}`} onClick={toggleAllSensorsSelection}>
                {isAllSensorsSelected ? "Deselect all sensors' fields" : "Select all sensors' fields"}
            </DropdownItem>
        );
    } else {
        return (
            <DropdownItem className="font-bold" onClick={deselectAllSelectedFields}>
                <span className="text-red-500">{isMultipleSelection ? "Deselect all" : "Deselect"}</span>
            </DropdownItem>
        )
    }
};

export default SensorFieldDropdown;
