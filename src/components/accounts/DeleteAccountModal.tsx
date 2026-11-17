import ConfirmModal from "@/components/common/ConfirmModal";

const DeleteAccountModal: React.FC<{
  email: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ email, onConfirm, onCancel }) => (
  <ConfirmModal
    title="Delete account?"
    message={
      <>
        <b>{email}</b> has never signed in, so it has no data. The account and its place in this campaign will be
        deleted. This can&apos;t be undone, but you can add the account again.
      </>
    }
    confirmLabel="Delete"
    onConfirm={onConfirm}
    onCancel={onCancel}
  />
);

export default DeleteAccountModal;
