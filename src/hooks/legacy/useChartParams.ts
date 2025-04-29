import { ChartParams, ChartType } from "@/types/chart";
import { useState } from "react";

function useChartParams(
    initialParams: ChartParams,
    chartType: ChartType[]
) {
    const [params, _setParams] = useState<{ [key: string]: ChartParams }>(chartType.reduce((acc, type) => {
        acc[type] = initialParams;
        return acc;
    }, {} as { [key: string]: ChartParams }));

    const setParams = (type: ChartType, params: ChartParams) => {
        _setParams((prev) => ({ ...prev, [type]: params }));
    }

    return { params, setParams };
}

export default useChartParams;