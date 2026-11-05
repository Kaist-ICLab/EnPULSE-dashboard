const SETUP_GUIDE_URL = "https://github.com/Kaist-ICLab/EnPULSE-dashboard#setup";

/** Shown instead of the app until the required Supabase settings are in `.env`. */
const SetupRequired: React.FC<{ missing: string[] }> = ({ missing }) => (
  <main className="flex h-screen w-full items-center justify-center bg-gray-50 p-8">
    <div className="max-w-xl">
      <h1 className="mb-2 text-2xl font-semibold text-gray-800">Finish setting up the dashboard</h1>
      <p className="mb-4 text-gray-600">
        The dashboard can&apos;t connect to Supabase, because these settings are missing or still placeholders:
      </p>
      <ul className="mb-6 flex flex-col gap-1">
        {missing.map((name) => (
          <li key={name}>
            <code className="rounded bg-gray-200 px-2 py-1 text-sm text-gray-800">{name}</code>
          </li>
        ))}
      </ul>
      <ol className="mb-6 list-decimal space-y-2 pl-5 text-gray-600">
        <li>
          Copy <code className="text-sm">.example.env</code> to <code className="text-sm">.env</code> if you
          haven&apos;t already, then fill in these settings.
        </li>
        <li>
          Restart <code className="text-sm">npm run dev</code>. For a production build, run{" "}
          <code className="text-sm">npm run build</code> again and then <code className="text-sm">npm start</code>.
        </li>
      </ol>
      <a href={SETUP_GUIDE_URL} className="text-blue-600 underline hover:text-blue-700">
        Read the setup guide
      </a>
    </div>
  </main>
);

export default SetupRequired;
