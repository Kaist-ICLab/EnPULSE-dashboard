const DailyStatTableCell: React.FC<{
  rowSpan?: number;
  colSpan?: number;
  className?: string;
  children?: React.ReactNode;
}> = ({ rowSpan, colSpan, className, children }) => {
  return (
    <th className={`border-r border-gray-200 p-2 ${className}`} rowSpan={rowSpan} colSpan={colSpan}>
      {children}
    </th>
  );
};

export default DailyStatTableCell;
