import { useState } from "react";
import { Button } from "@/components/common/buttons/Button";
import { DropdownButton } from "@/components/common/dropdown/DropdownButton";
import ConfirmModal from "@/components/common/modals/ConfirmModal";
import { FavoriteOptions } from "@/constants/indexInfoOptions";

const IndexFilterSection = () => {
  const [selectedViewKey, setSelectedViewKey] = useState<string | null>("all");

  // 모달 상태들
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLinkModalOpen, setLinkModalOpen] = useState(false);

  const handleViewChange = (key: string) => setSelectedViewKey(key);
  const handleDelete = () => {
    setDeleteModalOpen(false);
  };
  const handleLink = () => {
    setLinkModalOpen(false);
  };

  return (
    <div className="space-y-3 p-4">
      <div className="flex gap-2">
        <DropdownButton
          label={FavoriteOptions}
          value={selectedViewKey}
          onChange={handleViewChange}
          placeholder="옵션 선택"
          className="w-36"
        />
        <Button
          onClick={() => setDeleteModalOpen(true)}
          color="primary-destructive"
        >
          삭제 모달 열기
        </Button>
        <Button onClick={() => setLinkModalOpen(true)} color="secondary">
          연동 모달 열기
        </Button>
      </div>

      {/* 1. 삭제 컨펌 모달 */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="지수 정보 삭제"
      >
        <p className="text-sm text-gray-500">
          정말로 이 지수 정보를 삭제하시겠습니까?
        </p>
      </ConfirmModal>

      {/* 2. 일반 연동 컨펌 모달 */}
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

export default IndexFilterSection;
