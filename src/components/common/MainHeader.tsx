import Link from "next/link";

const MainHeader: React.FC = () => {
    return (
        <div className="px-4 border-b border-gray-200 py-2 flex flex-col items-center">
            <Link href="/">
                <div className="text-3xl font-bold">EnPULSE</div>
            </Link>
            <div className="text-xs font-light">Enabling Platform for User Logging and Sensing Environment</div>
        </div>
    )
}

export default MainHeader;