import { Form } from "react-aria-components";
import { Button } from "@/components/common/buttons/Button";
import { DatePicker } from "@/components/common/date-picker/DatePicker";
import { Input } from "@/components/common/input/Input";
import { Label } from "@/components/common/input/Label";
import { BaseModal } from "@/components/common/modals/BaseModal";
import { Toggle } from "@/components/common/toggle/toggle";

interface CreateIndexModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
const CreateIndexModal = ({ isOpen, onOpenChange }: CreateIndexModalProps) => {
  const handleCreate = () => {
    onOpenChange(false);
  };

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
            <Button onClick={handleCreate} className="w-full" isDisabled>
              등록
            </Button>
          </div>
        }
      >
        <Form
          validationBehavior="aria"
          // onSubmit={handleSubmit}
        >
          <div className="flex w-full flex-col gap-4">
            <Input
              label="분류명"
              placeholder="분류명을 입력해주세요"
              //   value={formData.name}
              //   onChange={(value) => handleChange("name", value)}
              isRequired
              //   isInvalid={!!errors.name}
              //   hint={errors.name}
            />
            <Input
              label="지수명"
              placeholder="지수명을 입력해주세요"
              //   value={formData.email}
              //   onChange={(value) => handleChange("email", value)}
              isRequired
              //   isInvalid={!!errors.email}
              //   hint={errors.email}
            />
            <div className="flex flex-col gap-1.5">
              <Label id="hire-date-label" isRequired>
                입사일
              </Label>
              <DatePicker
                //   value={formData.hireDate}
                placeholder="날짜를 선택해주세요"
                //   defaultValue={formData.hireDate ?? undefined}
                //   onChange={(value) => handleChange("hireDate", value)}
                //   onApply={handleApply}
                //   onCancel={handleCancel}
                //   className={formData.hireDate ? "" : placeholderStyle}
              />
              {/* {errors.hireDate && (
                <HintText isInvalid={!!errors.hireDate}>
                  {errors.hireDate}
                </HintText>
              )} */}
            </div>
            <div className="flex justify-between gap-3">
              <Input
                label="채용 종목 수"
                placeholder="0"
                // value={formData.position}
                // onChange={(value) => handleChange("position", value)}
                isRequired
                // isInvalid={!!errors.position}
                // hint={errors.position}
              />
              <Input
                label="기준 지수"
                placeholder="0"
                // value={formData.position}
                // onChange={(value) => handleChange("position", value)}
                isRequired
                // isInvalid={!!errors.position}
                // hint={errors.position}
              />
            </div>
          </div>
          <Toggle className="pt-8" label="즐겨찾기 등록" />
        </Form>
      </BaseModal>
    </>
  );
};

export default CreateIndexModal;
