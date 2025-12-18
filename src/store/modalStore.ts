import type { ReactNode } from "react";
import { create } from "zustand";

/** Confirm */
interface ConfirmProps {
  title: string;
  description: ReactNode;
  onConfirm: () => void | Promise<void>;
}

/** Index Data Form */
interface IndexDataFormValues {
  indexId: string;
  date: string;
  value: number;
}

interface IndexDataModalProps {
  mode: "create" | "edit";
  initial?: Partial<IndexDataFormValues>;
  onSubmit: (values: IndexDataFormValues) => void | Promise<void>;
}

type ModalState =
  | { type: "confirm"; props: ConfirmProps }
  | { type: "indexDataForm"; props: IndexDataModalProps };

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
