import IconButton from "./IconButton";

export const Modal: React.FC<{
  onClose: () => void;
  title: string;
  className?: string;
  children: React.ReactNode;
}> = ({ onClose, title, className, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-8">
      <div className={`flex flex-col rounded-lg bg-white shadow-lg ${className}`}>
        <div className="flex items-center justify-between gap-2 rounded-t-lg border-b border-gray-100 bg-gray-100 px-4 py-3">
          <h6 className="overflow-hidden text-lg font-semibold text-ellipsis whitespace-nowrap text-gray-900">
            {title}
          </h6>
          <IconButton onClick={onClose} size="lg" hoverColor="red" className="icon-[humbleicons--times]" />
        </div>
        {children}
      </div>
    </div>
  );
};
