import { useState } from "react";
import DataManagementFilter from "@/components/data-management/DataManagementFilter";
import DataManagementHeader from "@/components/data-management/DataManagementHeader";
import DataManagementTable from "@/components/data-management/DataManagementTable";
import type { IndexDataDto } from "@/model/indexData";

export default function DataManagement() {
  const [selected, setSelected] = useState<IndexDataDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IndexDataDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // 데이터 관리 추가 모달 열기
  const onAddClick = () => {
    setSelected(null);
    setIsModalOpen(true);
  };

  // 데이터 관리수정 모달 열기
  const onEditClick = (item: IndexDataDto) => {
    setSelected(item);
    setIsModalOpen(true);
  };

  // 데이터 관리 삭제 확인 모달 열기
  const onDeleteClick = (item: IndexDataDto) => {
    setDeleteTarget(item);
    setIsConfirmOpen(true);
  };

  return (
    <div className="border-secondary flex min-h-0 flex-col rounded-xl border bg-white">
      {/* <div className="flex flex-col">
        <button onClick={() => successToast("성공적으로 수정되었습니다.")}>
          성공
        </button>
        <button onClick={() => errorToast("수정에 실패하였습니다.")}>
          실패
        </button>
      </div>
      <Empty
        message="등록된 데이터가 없습니다."
        button={<Button>Open API 연동</Button>}
      /> */}
      <DataManagementHeader />
      <DataManagementFilter />
      <DataManagementTable onDelete={onDeleteClick} onEdit={onEditClick} />
    </div>
  );
}
