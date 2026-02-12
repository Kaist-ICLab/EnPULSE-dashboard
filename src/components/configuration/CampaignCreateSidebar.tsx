"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const DashboardSidebar: React.FC = () => {
    const pathname = usePathname();

    const steps = [
        { name: "Campaign Information", href: `/create/name` },
        { name: "Passive Sensing", href: `/create/passive-sensing` },
        { name: "Active Sensing", href: `/create/active-sensing` },
        { name: "Confirm Configuration", href: `/create/confirm` },
    ];

    const getCurrentStepIndex = () => {
        if (pathname.includes('/name')) return 0;
        if (pathname.includes('/passive-sensing')) return 1;
        if (pathname.includes('/active-sensing')) return 2;
        if (pathname.includes('/confirm')) return 3;
        return 0;
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div className="h-screen border-r border-gray-300 bg-gray-50 w-64 flex flex-col px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-8">Create Campaign</h2>
            <div className="flex flex-col relative">
                {/* Progress bar line */}
                <div className="absolute left-4 top-8 bottom-16 w-0.5 bg-gray-200">
                    <div
                        className="absolute top-0 left-0 w-full bg-blue-600 transition-all duration-300"
                        style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    />
                </div>

                {steps.map((step, index) => {
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;

                    return (
                        <Link
                            key={index}
                            href={step.href}
                            className={`relative flex items-center gap-4 mb-8 group ${isActive ? 'cursor-default' : 'cursor-pointer'
                                }`}
                        >
                            {/* Step number circle */}
                            <div
                                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${isActive
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : isCompleted
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-400'
                                    }`}
                            >
                                {isCompleted ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <span className="text-sm font-semibold">{index + 1}</span>
                                )}
                            </div>

                            {/* Step content */}
                            <div className="flex-1">
                                <div
                                    className={`text-sm font-medium transition-colors ${isActive
                                        ? 'text-blue-600'
                                        : isCompleted
                                            ? 'text-gray-700'
                                            : 'text-gray-400 group-hover:text-gray-600'
                                        }`}
                                >
                                    {step.name}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardSidebar;