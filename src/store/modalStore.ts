import type { ReactNode } from "react";
import { create } from "zustand";
import type { IndexDataDto } from "@/model/indexData";
import type { Index } from "@/pages/DataManagement";

type ModalState =
  | { type: "confirm"; props: ConfirmProps }
  | { type: "indexDataForm"; props: IndexDataModalProps }
  | { type: "indexDataSync"; props: IndexDataSyncModalProps };

// Confirm
interface ConfirmProps {
  title: string;
  variant?: "danger" | "primary";
  description: ReactNode;
  onConfirm: () => void | Promise<void>;
}

// IndexData
interface IndexDataModalProps {
  mode: "create" | "edit" | "view";
  initial?: Partial<IndexDataDto>;
}

// IndexDataSync
interface IndexDataSyncModalProps {
  index: Index;
}

interface ModalStore {
  modal: ModalState | null;

  close: () => void;

  openConfirm: (props: ConfirmProps) => void;
  openIndexDataForm: (props: IndexDataModalProps) => void;
  openIndexDataSync: (props: IndexDataSyncModalProps) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,

  close: () => set({ modal: null }),

  openConfirm: (props) => set({ modal: { type: "confirm", props } }),
  openIndexDataForm: (props) =>
    set({ modal: { type: "indexDataForm", props } }),
  openIndexDataSync: (props) =>
    set({ modal: { type: "indexDataSync", props } }),
}));
