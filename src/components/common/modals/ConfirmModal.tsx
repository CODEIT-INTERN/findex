import { AlertCircle } from "@untitledui/icons";
import { BaseModal } from "./BaseModal";
import { Button } from "../buttons/Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  description: string;
  onConfirm: () => void;
}

export default function ConfirmModal({ isOpen, onOpenChange, description, onConfirm }: ConfirmModalProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      footer={
        <>
          <Button color="secondary" className="w-full" onClick={handleClose}>
            취소
          </Button>
          <Button color="primary-destructive" className="w-full" onClick={handleConfirm}>
            삭제하기
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-2">
        <AlertCircle className="text-red-500 size-6" />
        <p className="whitespace-pre-line text-center text-sm font-medium">{description}</p>
      </div>
    </BaseModal>
  );
}
