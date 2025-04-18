import { useEffect, useState } from "react";
import { UserDailyStat } from "./useUserDailyStat";

export function useDailyStatTableCheckedState(
    data: UserDailyStat[]
) {
    const [checkedState, setCheckedState] = useState<boolean[]>(
        data.length > 0 ? data.map(() => false) : []
    );

    useEffect(() => {
        if (data.length !== checkedState.length) {
            setCheckedState(data.map(() => false));
        }
    }, [data, checkedState.length]);

    const checkCount = checkedState.filter((state) => state).length;
    const isAllChecked = checkedState.length > 0 && checkedState.every((state) => state);

    const toggleChecked = (index: number) => {
        const newCheckedState = [...checkedState];
        newCheckedState[index] = !newCheckedState[index];
        setCheckedState(newCheckedState);
    }

    const toggleAllChecked = () => {
        const newCheckedState = checkedState.map(() => !isAllChecked);
        setCheckedState(newCheckedState);
    }

    return { checkCount, toggleChecked, checkedState, isAllChecked, toggleAllChecked };
}