import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">Campaign Not Found</h2>
        <p className="mb-8 text-gray-500">
          The campaign you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/campaigns"
          className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Back to Campaigns
        </Link>
      </div>
    </div>
  );
}
