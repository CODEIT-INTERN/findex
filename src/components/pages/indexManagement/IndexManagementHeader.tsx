import { useState } from "react";
import { Plus, RefreshCcw05 } from "@untitledui/icons";
import { Button } from "@/components/common/buttons/Button";
import ConfirmModal from "@/components/common/modals/ConfirmModal";
import CreateIndexModal from "./CreateIndexModal";

export const IndexHeader = () => {
  // 모달 상태들
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isLinkModalOpen, setLinkModalOpen] = useState(false);

  const handleCreate = () => {
    setCreateModalOpen(false);
  };
  const handleLink = () => {
    setLinkModalOpen(false);
  };
  return (
    <div className="border-secondary flex justify-between border-b px-6 py-5">
      <div className="flex flex-col gap-0.5">
        <p className="text-lg font-semibold">지수 목록</p>
        <p className="text-tertiary text-sm">총 102개</p>
      </div>
      <div className="flex gap-3">
        <Button
          iconLeading={<Plus size={20} stroke="#414651" />}
          showTextWhileLoading
          color="secondary"
          onClick={() => setCreateModalOpen(true)}
        >
          지수 등록
        </Button>
        <Button
          iconLeading={<RefreshCcw05 size={20} stroke="white" />}
          showTextWhileLoading
          onClick={() => setLinkModalOpen(true)}
        >
          Open API 연동
        </Button>
      </div>
      {/* -------------------------모달------------------------ */}
      {/* 지수 등록 모달 */}
      <CreateIndexModal
        isOpen={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      {/* 지수 연동 모달 */}
      <ConfirmModal
        isOpen={isLinkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onConfirm={handleLink}
        title="지수 정보 연동"
        variant="primary"
      >
        <p className="text-sm text-gray-500">
          Open API를 통해 최신 지수 정보를 연동합니다.
        </p>
      </ConfirmModal>
    </div>
  );
};

export default IndexHeader;
