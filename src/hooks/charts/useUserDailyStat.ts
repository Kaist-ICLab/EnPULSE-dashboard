export type UserDailyStat = {
    uuid: string;
    email: string;
    contacts: number;
    columns: {
        [name: string]: DynamicDataColumn;
    };
};

export type DynamicDataColumn = {
    da
};

export const useUserDailyStat = (
    date: Date,
    page: number,
    rowsPerPage: number,
    setTotalPage: Dispatch<SetStateAction<number>>
) => {
    const [data, setData] = useState<UserDailyStat[]>([])
    const [loading, setLoading] = useState(true)

    const columns = useMemo(() => {
        return data.length > 0 ? Object.keys(data[0].columns) : []
    }, [data])

    // In practice, this should be calculated by the server as the client cannot see all the data
    const maxDailyCount = useMemo(() => {
        const result: { [key: string]: number } = {};
        columns.forEach(column => {
            result[column] = fakeData.reduce((max, user) => {
                return Math.max(max, user.columns[column].dailyCount);
            }, 0);
        });
        return result;
    }, [columns]);

    // TODO: Replace with actual API call
    useEffect(() => {
        setLoading(true)
        console.log("Pertending to load data...", date, page, rowsPerPage)

        setTimeout(() => {
            setData(fakeData.slice((page - 1) * rowsPerPage, page * rowsPerPage))
            setTotalPage(Math.ceil(fakeData.length / rowsPerPage))
            setLoading(false)
        }, 500) // 시뮬레이션용 딜레이
    }, [date, page, rowsPerPage, setTotalPage])

    return { data, columns, maxDailyCount, loading }
}

export default useUserDailyStat