import { Spinner } from "flowbite-react";
import { CsvRowStatus } from "@/types/account";

const CsvRowStatusCell: React.FC<{ status: CsvRowStatus }> = ({ status }) => {
  switch (status.state) {
    case "ready":
      return <span className="text-gray-500">Ready</span>;
    case "creating":
      return (
        <span className="flex items-center gap-2 text-gray-500">
          <Spinner size="xs" /> Creating…
        </span>
      );
    case "created":
      return <span className="text-emerald-700">Created as PID {status.pid}</span>;
    case "invalid":
    case "failed":
      return <span className="text-red-600">{status.message}</span>;
  }
};

export default CsvRowStatusCell;
