"use client";

type Props = {
    open: boolean;
    message: string;
    title: string;
    onConfirm: () => void;
    onCancel: () => void;
    disabled?: boolean;
};

export default function ConfirmModal({
    open,
    message,
    title,
    onConfirm,
    onCancel,
    disabled = false,
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                </div>

                {/* Message */}
                <p className="text-sm text-gray-600 mb-6">
                    {message}
                </p>

                {/* Buttons */}
                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={disabled}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={disabled}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        <>
                            Xác nhận
                        </>
                    </button>
                </div>
            </div>
        </div>
    );
}