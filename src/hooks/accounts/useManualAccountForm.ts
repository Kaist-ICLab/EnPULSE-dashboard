import { useState } from "react";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { createCampaignAccount } from "@/services/accountService";
import { notify } from "@/utils/notify";
import { normalizeAccountEmail, validateNewAccount } from "@/utils/participantAccount";

/** State of the "Enter manually" dialog: one account at a time. */
export default function useManualAccountForm(onCreated: () => Promise<void>, onClose: () => void) {
  const campaignId = useCampaignStore((state) => state.campaign?.id);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (campaignId === undefined) return;
    const validationError = validateNewAccount(email, password);
    setError(validationError);
    if (validationError) return;

    setIsSubmitting(true);
    try {
      const pid = await createCampaignAccount(campaignId, email, password);
      notify.success(`Created ${normalizeAccountEmail(email)} as PID ${pid}.`);
      await onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create the account.");
      setIsSubmitting(false);
    }
  };

  return { email, setEmail, password, setPassword, isSubmitting, error, submit };
}
