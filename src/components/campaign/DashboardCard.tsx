import { ReactNode } from "react"

const DashboardCard: React.FC<{
    children?: ReactNode,
    className?: string,
}> = ({ children, className }) => {
    return (
        <div className={`bg-white rounded-xl shadow-md p-4 w-full overflow-hidden ${className}`}>
            {children}
        </div>
    )
}

export default DashboardCard;