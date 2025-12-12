import { useToastStore } from "@/store/toastStore";

export default function DataManagement() {
  const { successToast, errorToast } = useToastStore();
  return (
    <div className="space-y-3">
      <div className="flex flex-col">
        <button onClick={() => successToast("성공적으로 수정되었습니다.")}>
          성공
        </button>
        <button onClick={() => errorToast("수정에 실패하였습니다.")}>
          실패
        </button>
      </div>
    </div>
  );
}
