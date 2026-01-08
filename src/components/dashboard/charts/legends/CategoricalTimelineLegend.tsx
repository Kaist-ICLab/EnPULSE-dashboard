
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import { scaleOrdinal } from '@visx/scale';

export const CategoricalTimelineLegend: React.FC<{
    uniqueCategories: number[],
    getCategoryColor: (categoryIndex: number) => string,
    handleLegendClick: (categoryIndex: number) => void
}> = ({ uniqueCategories, getCategoryColor, handleLegendClick }) => {
    const ordinalScale = scaleOrdinal<number, string>({
        domain: uniqueCategories,
        range: uniqueCategories.map((_, idx) => getCategoryColor(idx)),
    });

    if (uniqueCategories.length === 0) return null;

    return (
        <div className="w-full flex justify-center mb-2" style={{ height: 30 }}>
            <LegendOrdinal
                scale={ordinalScale}
                labelFormat={(label) => label}
                itemMargin="0 10px"
                direction="row"
            >
                {(labels) => (
                    <div className="flex flex-row flex-wrap justify-center gap-2">
                        {labels.map((label, i) => {
                            const categoryIndex = uniqueCategories.indexOf(Number(label.text));
                            return (
                                <LegendItem
                                    key={`legend-${i}`}
                                    onClick={() => handleLegendClick(categoryIndex)}
                                    className="flex flex-row items-center cursor-pointer"
                                >
                                    <svg width={12} height={12} className="mr-1">
                                        <rect width={12} height={12} fill={getCategoryColor(categoryIndex)} />
                                    </svg>
                                    <LegendLabel align="left">
                                        {label.text}
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