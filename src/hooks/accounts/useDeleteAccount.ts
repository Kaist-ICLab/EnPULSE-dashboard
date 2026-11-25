import { useState } from "react";
import { deleteUnusedAccount } from "@/services/accountService";
import { Participant } from "@/types/account";
import { notify } from "@/utils/notify";

/** Delete flow for the participant table: pick an account, confirm, then delete it. */
export default function useDeleteAccount(onDeleted: () => Promise<void>) {
  const [pendingDelete, setPendingDelete] = useState<Participant | null>(null);
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { uuid, email } = pendingDelete;
    setPendingDelete(null);
    setDeletingUuid(uuid);
    try {
      await deleteUnusedAccount(uuid);
      notify.success(`Deleted ${email}.`);
    } catch (err) {
      notify.error("Failed to delete the account", err instanceof Error ? err.message : "Unknown error");
    } finally {
      await onDeleted();
      setDeletingUuid(null);
    }
  };

  return {
    pendingDelete,
    deletingUuid,
    requestDelete: setPendingDelete,
    cancelDelete: () => setPendingDelete(null),
    confirmDelete,
  };
}
