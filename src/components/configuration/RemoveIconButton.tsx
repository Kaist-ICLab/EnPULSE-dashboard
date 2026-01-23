const RemoveIconButton: React.FC<{ onClick: () => void, size: 'sm' | 'md' | 'lg', className?: string }> = ({ onClick, size = 'md', className = "" }) => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8';
    return (
        <span
            className={`icon-[humbleicons--times] cursor-pointer text-gray-500 hover:text-red-500 ${sizeClass} ${className}`}
            onClick={onClick}
        ></span>
    )
}

export default RemoveIconButton;