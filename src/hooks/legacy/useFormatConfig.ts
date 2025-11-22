import { useEffect, useState } from 'react';
import { ColumnRole, DataType, FormatConfig, ThresholdMode } from '@/components/settings/FormatConfigTable';

// Sample format config data that matches the UserDailyStat structure
const sampleFormatConfig: { [key: string]: FormatConfig } = {
    call_log: {
        threshold: 1000,
        thresholdMode: 'value',
        dataConfig: {
            dailyCount: {
                columnRole: 'data',
                dataType: 'numerical'
            },
            timeline: {
                columnRole: 'data',
                dataType: 'numerical'
            }
        }
    },
    location: {
        threshold: 100,
        thresholdMode: 'max',
        dataConfig: {
            dailyCount: {
                columnRole: 'data',
                dataType: 'numerical'
            },
            timeline: {
                columnRole: 'data',
                dataType: 'numerical'
            }
        }
    },
    battery: {
        threshold: 100,
        thresholdMode: 'value',
        dataConfig: {
            dailyCount: {
                columnRole: 'data',
                dataType: 'numerical'
            },
            timeline: {
                columnRole: 'data',
                dataType: 'numerical'
            }
        }
    },
    x_y: {
        threshold: 100,
        thresholdMode: 'max',
        dataConfig: {
            dailyCount: {
                columnRole: 'data',
                dataType: 'numerical'
            },
            timeline: {
                columnRole: 'data',
                dataType: 'numerical'
            }
        }
    },
    x_z: {
        threshold: 100,
        thresholdMode: 'max',
        dataConfig: {
            dailyCount: {
                columnRole: 'data',
                dataType: 'numerical'
            },
            timeline: {
                columnRole: 'data',
                dataType: 'numerical'
            }
        }
    }
};

export const useFormatConfig = () => {
    const [formatConfig, setFormatConfig] = useState<{ [key: string]: FormatConfig }>({});
    const [sensors, setSensors] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // TODO: Replace with actual API call
    useEffect(() => {
        setLoading(true)
        console.log("Pertending to load data...")

        setTimeout(() => {
            const sensors = Object.keys(sampleFormatConfig)
            setFormatConfig(sampleFormatConfig)
            setSensors(sensors)
            setLoading(false)
        }, 1000)
    }, [])

    const loadFormatConfig = () => {
        setLoading(true)
        console.log("Pertending to load data...")

        setTimeout(() => {
            setFormatConfig(sampleFormatConfig)
            setLoading(false)
            setHasUnsavedChanges(false)
        }, 1000)
    }

    const updateColumnRole = (sensorName: string, columnName: string, value: ColumnRole) => {
        if (!sensorName || !formatConfig) return

        const newFormatConfig = structuredClone(formatConfig)
        newFormatConfig[sensorName].dataConfig[columnName].columnRole = value
        setFormatConfig(newFormatConfig)
        setHasUnsavedChanges(true)
    }

    const updateDataType = (sensorName: string, columnName: string, value: DataType) => {
        if (!sensorName || !formatConfig) return

        const newFormatConfig = structuredClone(formatConfig)
        newFormatConfig[sensorName].dataConfig[columnName].dataType = value
        setFormatConfig(newFormatConfig)
        setHasUnsavedChanges(true)
    }

    const updateThreshold = (sensorName: string, value: number, mode: ThresholdMode) => {
        if (!sensorName || !formatConfig) return

        const newFormatConfig = structuredClone(formatConfig)
        newFormatConfig[sensorName].threshold = value
        newFormatConfig[sensorName].thresholdMode = mode
        setFormatConfig(newFormatConfig)
        setHasUnsavedChanges(true)
    }

    const uploadFormatConfig = () => {
        // TODO: Put the data to the server
    };

    return {
        loading,
        formatConfig,
        sensors,
        hasUnsavedChanges,
        loadFormatConfig,
        updateColumnRole,
        updateDataType,
        updateThreshold,
        uploadFormatConfig,
    };
};

export default useFormatConfig; 