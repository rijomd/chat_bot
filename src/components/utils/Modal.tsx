import React from "react";
import { CloseIcon, ErrorIcon, SuccessIcon, WarningIcon } from "@/icons/icons";
import { ModalProps } from "@/types/modal";


export const Modal: React.FC<ModalProps> = ({ show, type, title, message, onClose }) => {
    if (!show) return null;

    const typeStyles = {
        success: {
            icon: SuccessIcon(),
            bg: "bg-green-100",
            title: title || "Success",
        },
        error: {
            icon: ErrorIcon(),
            bg: "bg-red-100",
            title: title || "Error",
        },
        warning: {
            icon: WarningIcon(),
            bg: "bg-yellow-100",
            title: title || "Warning",
        },
        "": {
            icon: null,
            bg: "bg-gray-100",
            title: "",
        },
    };

    const { icon, bg, title: modalTitle } = typeStyles[type];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 z-50">
            <div className={`relative ${bg} rounded-2xl p-6 w-80 shadow-lg text-center animate-[fadeIn_0.3s_ease-in-out] backdrop-blur-sm`}>
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 cursor-pointer"
                    onClick={onClose}
                >
                    {CloseIcon()}
                </button>

                <div className="flex flex-col items-center space-y-3">
                    {icon}
                    <h2 className="text-xl font-semibold text-gray-800">{modalTitle}</h2>
                    <p className="text-gray-700">{message}</p>
                    <button
                        onClick={onClose}
                        className={`mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-${bg} transition-all cursor-pointer`}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
