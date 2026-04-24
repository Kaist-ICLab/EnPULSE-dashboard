const IconButton: React.FC<{
    onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    hoverColor?: 'gray' | 'red';
    className?: string;
}> = ({ disabled = false, onClick, size = 'md', hoverColor = 'gray', className = "" }) => {
    const sizeClass = size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6';
    const hoverColorClass = hoverColor === 'gray' ? 'hover:text-gray-700' : 'hover:text-red-500';
    return (
        <span className={`${disabled ? `text-gray-300` : `cursor-pointer text-gray-500 ${hoverColorClass}`} ${sizeClass} ${className} inline-block`} onClick={(e) => { if (!disabled) onClick(e); }}></span>
    )
}

export default IconButton;