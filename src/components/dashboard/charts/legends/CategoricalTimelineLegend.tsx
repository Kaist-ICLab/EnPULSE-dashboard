
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import { scaleOrdinal } from '@visx/scale';

export const CategoricalTimelineLegend: React.FC<{
    uniqueCategories: string[],
    getCategoryColor: (category: string) => string,
    handleLegendClick: (category: string) => void,
    mapping: Map<string, string> | undefined
}> = ({ uniqueCategories, getCategoryColor, handleLegendClick, mapping }) => {
    const ordinalScale = scaleOrdinal<string, string>({
        domain: uniqueCategories,
        range: uniqueCategories.map((category) => getCategoryColor(category)),
    });

    if (uniqueCategories.length === 0) return null;

    return (
        <div className="w-full flex justify-center text-xs bg-white/50">
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