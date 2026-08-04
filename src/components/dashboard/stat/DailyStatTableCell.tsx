const DailyStatTableCell: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <td className={`px-2 py-1.5 border-r border-gray-200 ${className ?? ''}`}>{children}</td>
    );
}

export default DailyStatTableCell
