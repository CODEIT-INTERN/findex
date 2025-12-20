"use client";

import { useModalStore } from "@/store/modalStore";
import ConfirmModal from "./common/modals/ConfirmModal";
import IndexDataModal from "./data-management/IndexDataModal";
import IndexDataSyncModal from "./data-management/IndexDataSyncModal";

export function ModalHost() {
  const { modal, close } = useModalStore();

  if (!modal) return null;

  switch (modal.type) {
    case "confirm":
      return (
        <ConfirmModal
          isOpen
          title={modal.props.title}
          variant={modal.props.variant}
          onClose={close}
          onConfirm={async () => {
            await modal.props.onConfirm();
            close();
          }}
        >
          {modal.props.description}
        </ConfirmModal>
      );

    case "indexDataForm":
      return (
        <IndexDataModal
          isOpen
          onClose={close}
          mode={modal.props.mode}
          initial={modal.props.initial}
        />
      );

    case "indexDataSync":
      return (
        <IndexDataSyncModal isOpen onClose={close} index={modal.props.index} />
      );

    default:
      return null;
  }
}
