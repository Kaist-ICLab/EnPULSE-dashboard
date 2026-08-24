const DailyStatTableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <td className={`border-r border-gray-200 px-2 py-1.5 ${className ?? ""}`}>{children}</td>;
};

export default DailyStatTableCell;
