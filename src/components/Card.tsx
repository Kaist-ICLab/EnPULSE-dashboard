import { ReactNode } from "react"

const Card: React.FC<{
    children: ReactNode
}> = ({ children }) => (
    <div className="w-full flex items-center justify-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 ">
        {children}
    </div>
)

export default Card