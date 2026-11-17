import dayjs from "dayjs";
import { Button, Spinner } from "flowbite-react";
import { AuthAccountInfo, Participant } from "@/types/account";

const formatTime = (time: string | null) => (time ? dayjs(time).format("MMM D, YYYY HH:mm") : "Never");

const ParticipantAccountRow: React.FC<{
  participant: Participant;
  /** Undefined when sign-in details are loading, failed to load, or the account no longer exists. */
  info: AuthAccountInfo | undefined;
  isInfoLoading: boolean;
  isDeleting: boolean;
  /** True while any row is being deleted, so only one delete runs at a time. */
  isActionDisabled: boolean;
  onDelete: () => void;
}> = ({ participant, info, isInfoLoading, isDeleting, isActionDisabled, onDelete }) => {
  const showInfo = (value: (info: AuthAccountInfo) => string) => (isInfoLoading ? "…" : info ? value(info) : "-");

  return (
    <tr className="border-b border-gray-100">
      <td className="px-4 py-3">{participant.pid}</td>
      <td className="px-4 py-3 font-medium text-gray-900">{participant.email || "-"}</td>
      <td className="px-4 py-3">{showInfo((i) => formatTime(i.createdAt))}</td>
      <td className="px-4 py-3">{showInfo((i) => formatTime(i.lastSignInAt))}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          {isDeleting ? (
            <Spinner size="sm" />
          ) : (
            info?.lastSignInAt === null && (
              <Button
                size="xs"
                color="red"
                disabled={isActionDisabled}
                title="Only accounts that have never signed in can be deleted."
                onClick={onDelete}
              >
                Delete
              </Button>
            )
          )}
        </div>
      </td>
    </tr>
  );
};

export default ParticipantAccountRow;
