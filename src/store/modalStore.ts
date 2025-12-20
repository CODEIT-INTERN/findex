import type { ReactNode } from "react";
import { create } from "zustand";
import type { IndexDataDto } from "@/model/indexData";

type ModalState =
  | { type: "confirm"; props: ConfirmProps }
  | { type: "indexDataForm"; props: IndexDataModalProps };

// Confirm
interface ConfirmProps {
  title: string;
  description: ReactNode;
  onConfirm: () => void | Promise<void>;
}

// IndexData
interface IndexDataModalProps {
  mode: "create" | "edit" | "view";
  initial?: Partial<IndexDataDto>;
}

interface ModalStore {
  modal: ModalState | null;

  close: () => void;

  openConfirm: (props: ConfirmProps) => void;
  openIndexDataForm: (props: IndexDataModalProps) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,

  close: () => set({ modal: null }),

  openConfirm: (props) => set({ modal: { type: "confirm", props } }),
  openIndexDataForm: (props) =>
    set({ modal: { type: "indexDataForm", props } }),
}));
