import { useState } from "react";
import { Form, type DateValue } from "react-aria-components";
import { createIndexInfo } from "@/api/indexInfoApi";
import { Button } from "@/components/common/buttons/Button";
import { DatePicker } from "@/components/common/date-picker/DatePicker";
import { Input } from "@/components/common/input/Input";
import { Label } from "@/components/common/input/Label";
import { BaseModal } from "@/components/common/modals/BaseModal";
import { Toggle } from "@/components/common/toggle/toggle";
import { useIndexIndexListStore } from "@/store/indexInfoListStore";
import { useToastStore } from "@/store/toastStore";

interface CreateIndexModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
const CreateIndexModal = ({ isOpen, onOpenChange }: CreateIndexModalProps) => {
  // 전역상태 관리
  const { fetch } = useIndexIndexListStore();
  // 성공, 에러 토스트
  const successToast = useToastStore((state) => state.successToast);
  const errorToast = useToastStore((state) => state.errorToast);
  // 초기값
  const initialData = {
    indexClassification: "",
    indexName: "",
    basePointInTime: null as DateValue | null,
    employedItemsCount: "",
    baseIndex: "",
    favorite: true,
  };
  // 폼데이터
  const [formData, setFormData] = useState(initialData);
  const isEmpty = (value: string | number) => value === "" || value === null;
  // 모달 닫히면 데이터 초기화
  // 입력 핸들러
  const handleChange = (key: keyof typeof formData, value: unknown) => {
    // 숫자만 들어와야 하는 필드 체크
    if (key === "employedItemsCount" || key === "baseIndex") {
      // value가 string인 경우에만 replace
      const numericValue =
        typeof value === "string" ? value.replace(/[^0-9]/g, "") : "";
      setFormData((prev) => ({ ...prev, [key]: numericValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  // API 호출
  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();

    try {
      await createIndexInfo({
        ...formData,
        // 문자열 -> 숫자 변환
        employedItemsCount: Number(formData.employedItemsCount),
        baseIndex: Number(formData.baseIndex),
        // 날짜를 문자 객체로 변환
        basePointInTime: formData.basePointInTime?.toString() || "",
      });

      successToast("성공적으로 등록되었습니다.");
      fetch();
      onOpenChange(false);
      // 폼 초기화
      setFormData({
        indexClassification: "",
        indexName: "",
        basePointInTime: null,
        employedItemsCount: "",
        baseIndex: "",
        favorite: true,
      });
    } catch (err) {
      console.error(err);
      errorToast("등록에 실패하였습니다.");
    }
  };
  // 필수 입력값 체크
  const isFormValid =
    formData.indexClassification &&
    formData.indexName &&
    formData.basePointInTime &&
    formData.employedItemsCount &&
    formData.baseIndex;
  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="지수 정보 등록"
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
              onClick={handleCreate}
              className="w-full"
              isDisabled={!isFormValid}
            >
              등록
            </Button>
          </div>
        }
      >
        <Form validationBehavior="aria" onSubmit={handleCreate}>
          <div className="flex w-full flex-col gap-4">
            <Input
              label="분류명"
              placeholder="분류명을 입력해주세요"
              value={formData.indexClassification}
              onChange={(value) => handleChange("indexClassification", value)}
              isRequired
            />
            <Input
              label="지수명"
              placeholder="지수명을 입력해주세요"
              value={formData.indexName}
              onChange={(value) => handleChange("indexName", value)}
              isRequired
            />
            <div className="flex flex-col gap-1.5">
              <Label id="hire-date-label" isRequired>
                기준 시점
              </Label>
              <DatePicker
                value={formData.basePointInTime}
                placeholder="날짜를 선택해주세요"
                onChange={(value) => handleChange("basePointInTime", value)}
              />
            </div>
            <div className="flex justify-between gap-3">
              <Input
                label="채용 종목 수"
                placeholder="0"
                value={formData.employedItemsCount}
                onChange={(value) => handleChange("employedItemsCount", value)}
                isRequired
                isInvalid={isEmpty(formData.employedItemsCount)}
              />
              <Input
                label="기준 지수"
                placeholder="0"
                value={formData.baseIndex}
                onChange={(value) => handleChange("baseIndex", value)}
                isRequired
                isInvalid={isEmpty(formData.baseIndex)}
              />
            </div>
          </div>
          <Toggle
            className="pt-8"
            label="즐겨찾기 등록"
            isSelected={formData.favorite}
            onChange={(value) => handleChange("favorite", value)}
          />
        </Form>
      </BaseModal>
    </>
  );
};

export default CreateIndexModal;
