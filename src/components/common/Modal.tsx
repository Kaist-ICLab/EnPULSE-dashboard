import IconButton from "./IconButton";

export const Modal: React.FC<{
    onClose: () => void;
    title: string;
    className?: string;
    children: React.ReactNode;
}> = ({ onClose, title, className, children }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-8">
            <div className={`bg-white rounded-lg shadow-lg flex flex-col ${className}`}>
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2 bg-gray-100 rounded-t-lg">
                    <h6 className="text-lg font-semibold text-gray-900 text-ellipsis overflow-hidden whitespace-nowrap">{title}</h6>
                    <IconButton
                        onClick={onClose}
                        size="lg"
                        hoverColor="red"
                        className="icon-[humbleicons--times]"
                    />
                </div>
                {children}
            </div>
        </div>
    )
}