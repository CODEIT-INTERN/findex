import { useState } from "react";
import type { DateRange } from "react-aria-components";
import { syncIndexData } from "@/api/indexDataApi";
import type { IndexDataSyncRequest } from "@/model/indexData";
import type { Index } from "@/pages/DataManagement";
import { useIndexDataListStore } from "@/store/indexDataListStore";
import { useToastStore } from "@/store/toastStore";
import { formatDateValue } from "@/utils/date";
import { DateRangePicker } from "../common/date-picker/DateRangePicker";
import { Label } from "../common/input/Label";
import ConfirmModal from "../common/modals/ConfirmModal";

interface IndexDataSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  index: Index;
}

export default function IndexDataSyncModal({
  isOpen,
  onClose,
  index,
}: IndexDataSyncModalProps) {
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const { successToast, errorToast } = useToastStore();
  const { fetch } = useIndexDataListStore();

  // 날짜 변경 핸들러
  const handleDateChange = (value: DateRange | null) => {
    setDateRange(value);
  };
  // 날짜 취소 핸들러
  const handleDateCancel = () => {
    setDateRange(null);
  };
  // 지수 데이터 연동
  const handleSyncClick = async () => {
    if (!dateRange) return;

    const requestBody: IndexDataSyncRequest = {
      indexInfoIds: [index.id],
      baseDateFrom: formatDateValue(dateRange?.start),
      baseDateTo: formatDateValue(dateRange?.end),
    };

    try {
      await syncIndexData(requestBody);
      await fetch();

      successToast("연동이 완료되었습니다.");
      onClose();
    } catch (error) {
      console.log(error);
      errorToast("연동 중 오류가 발생하였습니다.");
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      variant="primary"
      title={`${index.label} 데이터 연동`}
      confirmText="연동"
      onConfirm={handleSyncClick}
      isDisabled={!dateRange}
    >
      <div className="flex w-full flex-col gap-2">
        <p className="text-tertiary mb-6 text-sm font-normal">
          Open API를 통해 최신 지수 데이터를 연동합니다.
        </p>
        <Label aria-label="날짜" isRequired>
          대상 날짜
        </Label>
        <DateRangePicker
          aria-label="날짜"
          placeholder="날짜를 선택해주세요"
          value={dateRange}
          onChange={(value) => handleDateChange(value)}
          onCancel={handleDateCancel}
          className="w-full"
        />
      </div>
    </ConfirmModal>
  );
}
