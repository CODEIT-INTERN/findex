import { useState } from "react";
import { Form, type DateValue } from "react-aria-components";
import { updateIndexInfo } from "@/api/indexInfoApi";
import { Button } from "@/components/common/buttons/Button";
import { DatePicker } from "@/components/common/date-picker/DatePicker";
import { Input } from "@/components/common/input/Input";
import { Label } from "@/components/common/input/Label";
import { BaseModal } from "@/components/common/modals/BaseModal";
import { Toggle } from "@/components/common/toggle/toggle";
import type { IndexInfoResponse } from "@/model/indexInfo";
import { useIndexIndexListStore } from "@/store/indexInfoListStore";
import { useToastStore } from "@/store/toastStore";
import { parseDateValue } from "@/utils/date";

interface UpdateIndexModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: IndexInfoResponse;
}
const UpdateIndexModal = ({
  isOpen,
  onOpenChange,
  initialData,
}: UpdateIndexModalProps) => {
  const { fetch } = useIndexIndexListStore();
  const { successToast, errorToast } = useToastStore();

  // initialData 초기 상태 설정
  const [formData, setFormData] = useState({
    // 문자열 날짜를 DateValue로 변환
    basePointInTime: initialData.basePointInTime
      ? parseDateValue(initialData.basePointInTime)
      : (null as DateValue | null),
    employedItemsCount: initialData.employedItemsCount.toString(),
    baseIndex: initialData.baseIndex.toString(),
    favorite: initialData.favorite,
  });

  const isEmpty = (value: string | number | null) =>
    value === "" || value === null;

  // 값 변경 핸들러
  const handleChange = (
    key: "employedItemsCount" | "baseIndex",
    value: string,
  ) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({ ...prev, [key]: numericValue }));
  };

  // 수정 핸들러
  const handleUpdate = async (e?: React.FormEvent) => {
    e?.preventDefault();

    try {
      await updateIndexInfo(initialData.id, {
        ...formData,
        employedItemsCount: Number(formData.employedItemsCount),
        baseIndex: Number(formData.baseIndex),
        basePointInTime: formData.basePointInTime?.toString() || "",
      });

      successToast("성공적으로 수정되었습니다.");
      fetch();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      errorToast("수정에 실패했습니다.");
    }
  };

  // 유효성 검사
  const isFormValid =
    formData.basePointInTime &&
    !isEmpty(formData.employedItemsCount) &&
    !isEmpty(formData.baseIndex);

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="지수 정보 수정"
        className="w-[376px]"
        contentClassName="p-6"
        footer={
          <div className="flex w-full justify-between gap-3">
            <Button
              color="secondary"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              취소
            </Button>
            <Button
              onClick={handleUpdate}
              className="w-full"
              isDisabled={!isFormValid}
            >
              수정
            </Button>
          </div>
        }
      >
        <Form validationBehavior="aria" onSubmit={handleUpdate}>
          <div className="flex w-full flex-col gap-4">
            <Input
              label="분류명"
              value={initialData.indexClassification}
              isDisabled
            />
            <Input
              label="지수명"
              placeholder="지수명을 입력해주세요"
              value={initialData.indexName}
              isDisabled
            />
            <div className="flex flex-col gap-1.5">
              <Label id="hire-date-label" isRequired>
                기준 시점
              </Label>
              <DatePicker
                value={formData.basePointInTime}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, basePointInTime: val }))
                }
              />
            </div>
            <div className="flex justify-between gap-3">
              <Input
                label="채용 종목 수"
                placeholder="0"
                value={formData.employedItemsCount}
                onChange={(val) => handleChange("employedItemsCount", val)}
                isInvalid={isEmpty(formData.employedItemsCount)}
                isRequired
              />
              <Input
                label="기준 지수"
                placeholder="0"
                value={formData.baseIndex}
                onChange={(val) => handleChange("baseIndex", val)}
                isInvalid={isEmpty(formData.baseIndex)}
                isRequired
              />
            </div>
          </div>
          <Toggle
            className="pt-8"
            label="즐겨찾기 등록"
            isSelected={formData.favorite}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, favorite: val }))
            }
          />
        </Form>
      </BaseModal>
    </>
  );
};

export default UpdateIndexModal;
