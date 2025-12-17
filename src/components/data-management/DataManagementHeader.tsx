import { useEffect } from "react";
import { Plus, RefreshCcw05, Share01 } from "@untitledui/icons";
import { Button } from "@/components/common/buttons/Button";
import { useIndexDataListStore } from "@/store/indexDataListStore";

export default function DataManagementHeader() {
  const { totalElements } = useIndexDataListStore();

  return (
    <div className="border-secondary flex items-center justify-between border-b px-6 py-5">
      <div className="flex shrink-0 flex-col justify-center">
        <h2 className="text-lg leading-7 font-semibold">데이터 목록</h2>
        <span className="text-tertiary text-sm font-normal">
          총 {totalElements.toLocaleString("kr")}개
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Button color="tertiary" iconLeading={<Share01 size={20} />}>
          Export
        </Button>
        <Button color="secondary" iconLeading={<Plus size={20} />}>
          데이터 등록
        </Button>
        <Button iconLeading={<RefreshCcw05 size={20} />}>Open API 연동</Button>
      </div>
    </div>
  );
}
