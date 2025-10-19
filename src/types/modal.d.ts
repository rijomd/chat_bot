
export type ModalType = "success" | "error" | "warning" | "";

export type ModalProps = {
    show: boolean;
    type: ModalType;
    title?: string;
    message: string;
    onClose: () => void;
}
