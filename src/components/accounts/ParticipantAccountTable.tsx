import { Card } from "flowbite-react";
import useDeleteAccount from "@/hooks/accounts/useDeleteAccount";
import { AuthAccountInfo, Participant } from "@/types/account";
import DeleteAccountModal from "./DeleteAccountModal";
import ParticipantAccountRow from "./ParticipantAccountRow";

const ParticipantAccountTable: React.FC<{
  participants: Participant[];
  authInfo: Map<string, AuthAccountInfo> | null;
  isAuthInfoLoading: boolean;
  authInfoError: string | null;
  onChanged: () => Promise<void>;
}> = ({ participants, authInfo, isAuthInfoLoading, authInfoError, onChanged }) => {
  const { pendingDelete, deletingUuid, requestDelete, cancelDelete, confirmDelete } = useDeleteAccount(onChanged);

  return (
    <Card className="max-w-3xl 2xl:max-w-5xl">
      <h2 className="text-xl font-semibold text-gray-900">Participants</h2>
      {authInfoError && <p className="text-sm text-red-600">Could not load sign-in details: {authInfoError}</p>}
      {participants.length === 0 ? (
        <p className="text-sm text-gray-500">No participants yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-100 text-xs text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">PID</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Last sign-in</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <ParticipantAccountRow
                  key={participant.uuid}
                  participant={participant}
                  info={authInfo?.get(participant.uuid)}
                  isInfoLoading={isAuthInfoLoading}
                  isDeleting={deletingUuid === participant.uuid}
                  isActionDisabled={deletingUuid !== null}
                  onDelete={() => requestDelete(participant)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pendingDelete && (
        <DeleteAccountModal email={pendingDelete.email} onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
    </Card>
  );
};

export default ParticipantAccountTable;
