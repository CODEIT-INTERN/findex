import { useState } from "react";
import { Form, type DateValue } from "react-aria-components";
import { createIndexData, updateIndexData } from "@/api/indexDataApi";
import type { IndexDataCreateRequest, IndexDataDto } from "@/model/indexData";
import { useIndexDataListStore } from "@/store/indexDataListStore";
import { useToastStore } from "@/store/toastStore";
import { formatDateValue, parseDateValue } from "@/utils/date";
import { isValidDecimal } from "@/utils/decimal";
import { Button } from "../common/buttons/Button";
import { DatePicker } from "../common/date-picker/DatePicker";
import { Input } from "../common/input/Input";
import { Label } from "../common/input/Label";
import { BaseModal } from "../common/modals/BaseModal";

interface IndexDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  initial?: Partial<IndexDataDto>;
}

const initialFormValue = {
  indexInfoId: 0,
  baseDate: "",
  marketPrice: "",
  closingPrice: "",
  highPrice: "",
  lowPrice: "",
  versus: "",
  fluctuationRate: "",
  tradingQuantity: "",
  tradingPrice: "",
  marketTotalAmount: "",
};

type InvalidMap = Partial<Record<keyof IndexDataCreateRequest, boolean>>;

const numericFields = [
  "marketPrice",
  "closingPrice",
  "highPrice",
  "lowPrice",
  "versus",
  "fluctuationRate",
  "tradingQuantity",
  "tradingPrice",
  "marketTotalAmount",
] as const;

export default function IndexDataModal({
  isOpen,
  onClose,
  mode,
  initial,
}: IndexDataModalProps) {
  // 폼 데이터
  const [formData, setFormData] = useState(initial || initialFormValue);
  const [tempDate, setTempDate] = useState<DateValue | null>(
    parseDateValue(formData.baseDate) || null,
  );
  // 폼 입력 오류 상태
  const [invalid, setInvalid] = useState<InvalidMap>({});
  const [isPending, setIsPending] = useState(false);

  const { successToast, errorToast } = useToastStore();
  const { fetch } = useIndexDataListStore();

  // 값 변경 핸들러
  const handleChange = (
    field: keyof IndexDataCreateRequest,
    value: string | DateValue | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setInvalid((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
  };
  // 날짜 변경 핸들러
  const handleDateChange = (value: DateValue | null) => {
    setTempDate(value);
    setFormData({ ...formData, baseDate: formatDateValue(value) });
  };
  // 날짜 적용 핸들러
  const handleDateApply = () => {
    handleChange("baseDate", formatDateValue(tempDate));
  };
  // 날짜 취소 핸들러
  const handleDateCancel = () => {
    setTempDate(null);
    setFormData({ ...formData, baseDate: "" });
  };
  // 폼 제출
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextInvalid: InvalidMap = {};

    // 지수 확인
    if (!formData.indexInfoId) nextInvalid.indexInfoId = true;
    // 날짜 유효성 확인
    if (!formData.baseDate?.trim()) nextInvalid.baseDate = true;
    // 숫자 유효성 확인
    for (const field of numericFields) {
      if (
        !isValidDecimal(String(formData[field] ?? "")) ||
        formData[field] === "0"
      ) {
        nextInvalid[field] = true;
      }
    }

    setInvalid(nextInvalid);
    if (Object.values(nextInvalid).some(Boolean)) return;

    // submit 진행
    const payload = {
      baseDate: formData.baseDate ?? "",
      marketPrice: Number(formData.marketPrice),
      closingPrice: Number(formData.closingPrice),
      highPrice: Number(formData.highPrice),
      lowPrice: Number(formData.lowPrice),
      versus: Number(formData.versus),
      fluctuationRate: Number(formData.fluctuationRate),
      tradingQuantity: Number(formData.tradingQuantity),
      tradingPrice: Number(formData.tradingPrice),
      marketTotalAmount: Number(formData.marketTotalAmount),
    };

    setIsPending(true);
    try {
      if (mode === "edit" && initial?.id) {
        await updateIndexData(initial.id, payload);
      } else {
        await createIndexData({
          ...payload,
          indexInfoId: formData.indexInfoId ?? 0,
        });
      }
      successToast(
        `성공적으로 ${mode === "create" ? "등록" : "수정"}되었습니다`,
      );
      await fetch();
      onClose();
    } catch (error) {
      console.log(error);
      errorToast(`${mode === "create" ? "등록" : "수정"}에 실패하였습니다`);
    } finally {
      setIsPending(false);
    }
  };

  console.log(formData);
  console.log(invalid);

  return (
    <BaseModal isOpen={isOpen} onOpenChange={onClose} title="데이터 등록">
      <Form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label aria-label="날짜" isRequired>
            설립일
          </Label>
          <DatePicker
            aria-label="날짜"
            placeholder="날짜를 선택해주세요"
            value={tempDate}
            onChange={(value) => handleDateChange(value)}
            onApply={handleDateApply}
            onCancel={handleDateCancel}
            isInvalid={!!invalid.baseDate}
            isDisabled={mode === "edit"}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-4">
          <Input
            label="시가"
            placeholder="0"
            type="text"
            inputMode="numeric"
            value={formData.marketPrice?.toString()}
            onChange={(value) => handleChange("marketPrice", value)}
            isInvalid={!!invalid.marketPrice}
            isRequired
          />
          <Input
            label="종가"
            placeholder="0"
            type="text"
            inputMode="numeric"
            value={formData.closingPrice?.toString()}
            onChange={(value) => handleChange("closingPrice", value)}
            isInvalid={!!invalid.closingPrice}
            isRequired
          />
          <Input
            label="고가"
            placeholder="0"
            type="text"
            inputMode="numeric"
            value={formData.highPrice?.toString()}
            onChange={(value) => handleChange("highPrice", value)}
            isInvalid={!!invalid.highPrice}
            isRequired
          />
          <Input
            label="저가"
            placeholder="0"
            type="text"
            inputMode="numeric"
            value={formData.lowPrice?.toString()}
            onChange={(value) => handleChange("lowPrice", value)}
            isInvalid={!!invalid.lowPrice}
            isRequired
          />
          <Input
            label="대비"
            placeholder="0"
            type="text"
            inputMode="numeric"
            value={formData.versus?.toString()}
            onChange={(value) => handleChange("versus", value)}
            isInvalid={!!invalid.versus}
            isRequired
          />
          <Input
            label="등랄률 (%)"
            placeholder="0"
            type="text"
            inputMode="numeric"
            value={formData.fluctuationRate?.toString()}
            onChange={(value) => handleChange("fluctuationRate", value)}
            isInvalid={!!invalid.fluctuationRate}
            isRequired
          />
          <Input
            label="거래량"
            placeholder="0"
            type="text"
            inputMode="numeric"
            value={formData.tradingQuantity?.toString()}
            onChange={(value) => handleChange("tradingQuantity", value)}
            isInvalid={!!invalid.tradingQuantity}
            isRequired
          />
          <Input
            label="거래 대금"
            placeholder="0"
            type="text"
            inputMode="numeric"
            value={formData.tradingPrice?.toString()}
            onChange={(value) => handleChange("tradingPrice", value)}
            isInvalid={!!invalid.tradingPrice}
            isRequired
          />
          <Input
            label="시가 총액"
            placeholder="0"
            type="text"
            inputMode="numeric"
            value={formData.marketTotalAmount?.toString()}
            onChange={(value) => handleChange("marketTotalAmount", value)}
            isInvalid={!!invalid.marketTotalAmount}
            isRequired
            className="col-span-2"
          />
        </div>
        <div className="mt-6 flex gap-2">
          <Button
            color="secondary"
            className="w-full"
            onClick={onClose}
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            type="submit"
            color="primary"
            className="w-full"
            disabled={isPending}
          >
            {mode === "edit" ? "수정하기" : "등록하기"}
          </Button>
        </div>
      </Form>
    </BaseModal>
  );
}
