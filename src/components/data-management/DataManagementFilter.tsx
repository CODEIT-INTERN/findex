import { useState } from "react";
import type { DateRange } from "react-aria-components";
import { DateRangePicker } from "@/components/common/date-picker/DateRangePicker";
import { useIndexDataListStore } from "@/store/indexDataListStore";
import { formatDateRange } from "@/utils/date";
import IndexInfoSelect from "../common/select/IndexInfoSelect";

export default function DataManagementFilter() {
  const [tempDateRange, setTempDateRange] = useState<DateRange | null>(null);

  const { setFilters } = useIndexDataListStore();

  const handleDateChange = (value: DateRange | null) => {
    setTempDateRange(value);
  };

  // 날짜 범위 적용
  const handleDateApply = () => {
    if (!tempDateRange) return;
    const { start, end } = formatDateRange(tempDateRange);

    setFilters({
      startDate: start,
      endDate: end,
    });
  };

  // 취소 버튼 클릭 시 tempDateRange 초기화
  const handleDateCancel = () => {
    setTempDateRange(null);
    setFilters({
      startDate: "",
      endDate: "",
    });
  };

  const handleSelectChange = (id: number) => {
    setFilters({
      indexInfoId: id,
    });
  };

  return (
    <div className="flex gap-3 px-6 py-5">
      <IndexInfoSelect
        placeholder="전체 지수"
        onChange={(key) => handleSelectChange(key as number)}
        aria-label="지수 선택"
        className="w-42"
      />
      <DateRangePicker
        aria-label="날짜 선택"
        placeholder="날짜를 선택해주세요"
        value={tempDateRange}
        onChange={(value) => handleDateChange(value)}
        onApply={handleDateApply}
        onCancel={handleDateCancel}
      />
    </div>
  );
}
