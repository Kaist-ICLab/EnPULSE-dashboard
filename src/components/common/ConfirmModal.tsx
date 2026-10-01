"use client";

import { Button } from "flowbite-react";
import { Modal } from "./Modal";

/** A yes/no confirmation for destructive actions, built on the shared Modal. */
const ConfirmModal: React.FC<{
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ title, message, confirmLabel, onConfirm, onCancel }) => (
  <Modal onClose={onCancel} title={title} className="w-full max-w-md">
    <div className="flex flex-col gap-4 p-5">
      <div className="text-sm text-gray-700">{message}</div>
      <div className="flex justify-end gap-2">
        <Button color="gray" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmModal;
