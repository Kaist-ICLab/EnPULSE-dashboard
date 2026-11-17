import { Button, Spinner, TextInput } from "flowbite-react";
import { Modal } from "@/components/common/Modal";
import PasswordForm from "@/components/configuration/form/PasswordForm";
import useManualAccountForm from "@/hooks/accounts/useManualAccountForm";
import { MIN_ACCOUNT_PASSWORD_LENGTH } from "@/utils/participantAccount";
import AccountSignInHint from "./AccountSignInHint";

const ManualAccountModal: React.FC<{
  onClose: () => void;
  onCreated: () => Promise<void>;
}> = ({ onClose, onCreated }) => {
  const { email, setEmail, password, setPassword, isSubmitting, error, submit } = useManualAccountForm(
    onCreated,
    onClose,
  );

  return (
    <Modal onClose={() => !isSubmitting && onClose()} title="Add Account" className="w-full max-w-md">
      <form
        className="flex flex-col gap-4 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <AccountSignInHint />
        <div className="flex flex-col gap-2">
          <label htmlFor="accountEmail" className="block text-sm font-medium text-gray-900">
            Email
          </label>
          <TextInput
            id="accountEmail"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="p001@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="accountPassword" className="block text-sm font-medium text-gray-900">
            Password
          </label>
          <PasswordForm
            id="accountPassword"
            password={password}
            setPassword={setPassword}
            placeholder={`At least ${MIN_ACCOUNT_PASSWORD_LENGTH} characters`}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button color="gray" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner size="sm" className="mr-2" />}
            Add Account
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ManualAccountModal;
