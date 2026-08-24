"use client";

import { Modal } from "@/components/common/Modal";
import { useCampaignListStore } from "@/providers/CampaignListStoreProvider";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { deleteCampaign, getCampaignList } from "@/services/campaignService";
import { notify } from "@/utils/notify";
import { Button, Card, Spinner, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DangerZoneForm = () => {
  const router = useRouter();
  const { campaign } = useCampaignStore((state) => state);
  const { setCampaignList } = useCampaignListStore((state) => state);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationName, setConfirmationName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const campaignName = campaign?.name ?? "";
  const canDelete = confirmationName === campaignName && !isDeleting;

  const closeModal = () => {
    if (isDeleting) return;

    setIsModalOpen(false);
    setConfirmationName("");
  };

  const handleDelete = async () => {
    if (!campaign?.id || !canDelete) return;

    setIsDeleting(true);

    try {
      await deleteCampaign(campaign.id);
      setCampaignList(await getCampaignList());
      notify.success(`Campaign "${campaignName}" removed`);
      router.replace("/campaigns");
      router.refresh();
    } catch {
      notify.error("Failed to remove the campaign — please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="border-red-200">
        <div className="flex flex-col gap-4">
          <h6 className="text-xl font-medium text-red-700">Danger Zone</h6>
          <div className="flex items-center justify-between gap-4 border-t border-red-100 pt-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Remove campaign</p>
              <p className="text-sm text-gray-600">This action cannot be undone.</p>
            </div>
            <Button color="red" onClick={() => setIsModalOpen(true)}>
              Remove campaign
            </Button>
          </div>
        </div>
      </Card>

      {isModalOpen && (
        <Modal onClose={closeModal} title="Remove campaign" className="w-full max-w-lg">
          <div className="flex flex-col gap-4 p-5">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              Removing the campaign <span className="font-semibold"> permanently deletes all collected data</span>. This
              includes participant records, sensor data, survey responses, row counts, and messages.
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="campaignDeleteConfirmation" className="text-sm font-medium text-gray-900">
                Type <span className="font-bold text-red-500">{campaignName}</span> to confirm.
              </label>
              <TextInput
                id="campaignDeleteConfirmation"
                value={confirmationName}
                onChange={(event) => setConfirmationName(event.target.value)}
                disabled={isDeleting}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button color="gray" onClick={closeModal} disabled={isDeleting}>
                Cancel
              </Button>
              <Button color="red" onClick={handleDelete} disabled={!canDelete}>
                {isDeleting ? (
                  <>
                    <Spinner size="sm" className="mr-2" /> Removing...
                  </>
                ) : (
                  "Remove campaign"
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DangerZoneForm;
