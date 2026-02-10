const DailyStatTableCell: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    return (
        <td className="p-2 border-r border-gray-200">{children}</td>
    );
}

export default DailyStatTableCell