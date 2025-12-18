import { useState } from "react";
import type { DateRange, DateValue } from "react-aria-components";
import { DateRangePicker } from "@/components/common/date-picker/DateRangePicker";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useIndexDataListStore } from "@/store/indexDataListStore";
import { formatDateRange, formatDateValueToIsoZ } from "@/utils/date";

export default function DataManagementFilter() {
  const [keyword, setKeyword] = useState("");
  const [tempDateRange, setTempDateRange] = useState<DateRange | null>(null);

  // 디바운스
  const debouncedKeyword = useDebouncedValue(keyword);

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

  return (
    <div className="px-6 py-5">
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
