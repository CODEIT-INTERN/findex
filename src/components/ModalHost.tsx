"use client";

import { useModalStore } from "@/store/modalStore";
import ConfirmModal from "./common/modals/ConfirmModal";

export function ModalHost() {
  const { modal, close } = useModalStore();

  if (!modal) return null;

  switch (modal.type) {
    case "confirm":
      return (
        <ConfirmModal
          isOpen
          title={modal.props.title}
          onClose={close}
          onConfirm={async () => {
            await modal.props.onConfirm();
            close();
          }}
        >
          {modal.props.description}
        </ConfirmModal>
      );

    // case "indexDataForm":
    //   return (
    //     <IndexDataRegisterModal
    //       isOpen
    //       onClose={close}
    //       mode={modal.props.mode}
    //       initial={modal.props.initial}
    //       onSubmit={async (values) => {
    //         await modal.props.onSubmit(values);
    //         close();
    //       }}
    //     />
    //   );

    default:
      return null;
  }
}
