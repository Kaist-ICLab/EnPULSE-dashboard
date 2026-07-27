
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import { scaleOrdinal } from '@visx/scale';
import { useCampaignStore } from '@/providers/CampaignStoreProvider';
import { useMemo } from 'react';

export const CategoricalTimelineLegend: React.FC<{
    fieldId: number,
    uniqueCategories: string[],
    getCategoryColor: (category: string) => string,
    handleLegendClick: (category: string) => void,
}> = ({ fieldId, uniqueCategories, getCategoryColor, handleLegendClick }) => {
    const { campaignTableFieldMapping } = useCampaignStore((state) => state);
    const mapping = useMemo(() => {
        return campaignTableFieldMapping.get(fieldId);
    }, [campaignTableFieldMapping, fieldId]);

    const ordinalScale = scaleOrdinal<string, string>({
        domain: uniqueCategories,
        range: uniqueCategories.map((category) => getCategoryColor(category)),
    });

    if (uniqueCategories.length === 0) return null;

    return (
        <div className="w-full flex justify-center text-xs bg-gray-100/70">
            <LegendOrdinal
                scale={ordinalScale}
                labelFormat={(label) => label}
                itemMargin="0 10px"
                direction="row"
            >
                {(labels) => (
                    <div className="flex flex-row flex-wrap justify-center gap-2">
                        {labels.map((label, i) => {
                            return (
                                <LegendItem
                                    key={`legend-${i}`}
                                    onClick={() => handleLegendClick(label.text)}
                                    className="flex flex-row items-center cursor-pointer"
                                >
                                    <svg width={12} height={12} className="mr-1">
                                        <rect width={12} height={12} fill={getCategoryColor(label.text)} />
                                    </svg>
                                    <LegendLabel align="left">
                                        {mapping?.get(label.text) ?? label.text}
                                    </LegendLabel>
                                </LegendItem>
                            );
                        })}
                    </div>
                )}
            </LegendOrdinal>
        </div>
    );
};