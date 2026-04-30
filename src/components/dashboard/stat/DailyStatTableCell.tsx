const DailyStatTableCell: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <td className={`p-2 border-r border-gray-200 ${className ?? ''}`}>{children}</td>
    );
}

export default DailyStatTableCell
