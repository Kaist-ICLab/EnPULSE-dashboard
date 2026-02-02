const DailyStatTableCell: React.FC<{
    rowSpan?: number;
    colSpan?: number;
    className?: string;
    children?: React.ReactNode;
}> = ({ rowSpan, colSpan, className, children }) => {
    return (
        <th className={`p-2 border-r border-gray-200 ${className}`} rowSpan={rowSpan} colSpan={colSpan}>{children}</th>
    );
}

export default DailyStatTableCell