import { DateRangePicker } from "@/components/common/date-picker/DateRangePicker";

export default function DataManagementFilter() {
  return (
    <div className="px-6 py-5">
      <DateRangePicker placeholder="날짜를 선택해주세요" />
    </div>
  );
}
