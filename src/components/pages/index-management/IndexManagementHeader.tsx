import { useState } from "react";
import { Plus, RefreshCcw05 } from "@untitledui/icons";
import { syncIndexInfo } from "@/api/indexInfoApi";
import { Button } from "@/components/common/buttons/Button";
import { Dot } from "@/components/common/foundations/dot-icon";
import ConfirmModal from "@/components/common/modals/ConfirmModal";
import { useIndexIndexListStore } from "@/store/indexInfoListStore";
import { useToastStore } from "@/store/toastStore";
import CreateIndexModal from "./CreateIndexModal";

export const IndexHeader = () => {
  const { fetch, totalElements } = useIndexIndexListStore();
  const { successToast, errorToast } = useToastStore();
  // 모달 및 상태관리
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isResultModalOpen, setResultModalOpen] = useState(false);

  // 결과 데이터 상태
  const [syncResult, setSyncResult] = useState({
    successCount: 0,
    failCount: 0,
  });
  const handleSync = async () => {
    try {
      const { successCount, failCount } = await syncIndexInfo();
      setSyncResult({ successCount, failCount });
      setConfirmModalOpen(false);
      setResultModalOpen(true);
      fetch();
      successToast("연동이 완료되었습니다.");
    } catch (err) {
      console.error(err);
      errorToast("지수 연동에 실패하였습니다.");
    }
  };
  return (
    <div className="border-secondary flex justify-between border-b px-6 py-5">
      <div className="flex flex-col gap-0.5">
        <p className="text-lg font-semibold">지수 목록</p>
        <p className="text-tertiary text-sm">총 {totalElements}개</p>
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
          onClick={() => setConfirmModalOpen(true)}
        >
          Open API 연동
        </Button>
      </div>
      {/* -------------------------모달------------------------ */}
      {/* 지수 등록 모달 */}
      {isCreateModalOpen && (
        <CreateIndexModal
          isOpen={isCreateModalOpen}
          onOpenChange={setCreateModalOpen}
        />
      )}
      {/* 지수 연동 컨펌 모달 */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleSync}
        title="지수 정보 연동"
        variant="primary"
      >
        <p className="text-sm text-gray-500">
          Open API를 통해 최신 지수 정보를 연동합니다.
        </p>
      </ConfirmModal>

      {/* 지수 연동 결과 모달 */}
      <ConfirmModal
        isOpen={isResultModalOpen}
        onClose={() => setResultModalOpen(false)}
        onConfirm={() => setResultModalOpen(false)}
        title="지수 정보 연동"
        variant="primary"
        isSingleButton
        confirmText="확인"
      >
        <div className="text-text-tertiary flex flex-col text-sm">
          <div className="flex items-center justify-start gap-1">
            <Dot className="text-fg-success-secondary h-1.5 w-1.5" />
            <span>성공 {syncResult.successCount}건</span>
          </div>
          <div className="flex items-center justify-start gap-1">
            <Dot className="text-fg-error-primary h-1.5 w-1.5" />
            <span>실패 {syncResult.failCount}건</span>
          </div>
        </div>
      </ConfirmModal>
    </div>
  );
};

export default IndexHeader;
