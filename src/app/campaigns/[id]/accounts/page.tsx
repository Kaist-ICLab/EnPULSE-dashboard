"use client";

import { useState } from "react";
import AddAccountDropdown from "@/components/accounts/AddAccountDropdown";
import CsvAccountModal from "@/components/accounts/CsvAccountModal";
import ManualAccountModal from "@/components/accounts/ManualAccountModal";
import ParticipantAccountTable from "@/components/accounts/ParticipantAccountTable";
import { CampaignHeader } from "@/components/common/CampaignHeader";
import useParticipantAccounts from "@/hooks/accounts/useParticipantAccounts";
import { AddAccountMode } from "@/types/account";

const AccountsPage: React.FC = () => {
  const { participants, authInfo, isAuthInfoLoading, authInfoError, reload } = useParticipantAccounts();
  const [openModal, setOpenModal] = useState<AddAccountMode | null>(null);
  const closeModal = () => setOpenModal(null);

  return (
    <>
      <CampaignHeader>
        <AddAccountDropdown onSelect={setOpenModal} />
      </CampaignHeader>
      <div className="flex w-full grow flex-row overflow-hidden">
        <main className="flex w-full grow flex-col items-stretch gap-4 overflow-auto p-4">
          <ParticipantAccountTable
            participants={participants}
            authInfo={authInfo}
            isAuthInfoLoading={isAuthInfoLoading}
            authInfoError={authInfoError}
            onChanged={reload}
          />
        </main>
      </div>
      {openModal === "manual" && <ManualAccountModal onClose={closeModal} onCreated={reload} />}
      {openModal === "csv" && <CsvAccountModal onClose={closeModal} onCreated={reload} />}
    </>
  );
};

export default AccountsPage;
