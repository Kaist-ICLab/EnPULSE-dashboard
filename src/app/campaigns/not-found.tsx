import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Campaign Not Found</h2>
                <p className="text-gray-500 mb-8">The campaign you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                <Link
                    href="/campaigns"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    View All Campaigns
                </Link>
            </div>
        </div>
    );
} 